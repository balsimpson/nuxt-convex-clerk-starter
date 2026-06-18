import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { paginationOptsValidator } from 'convex/server'

const authorValidator = v.object({
  name: v.string(),
  email: v.string(),
  photo: v.string(),
  uid: v.string()
})

const postInputValidator = {
  title: v.string(),
  description: v.string(),
  image: v.string(),
  slug: v.string(),
  status: v.string(),
  content: v.any(),
  tags: v.array(v.string()),
  published_at: v.any(),
  author: authorValidator
}

export const latest = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(Math.floor(args.limit ?? 3), 1), 12)
    const posts = await ctx.db
      .query('posts')
      .withIndex('by_status_and_published_at', q => q.eq('status', 'published'))
      .order('desc')
      .take(limit)

    return posts.map(post => ({
      _id: post._id,
      title: post.title,
      description: post.description,
      image: post.image,
      slug: post.slug,
      tags: post.tags,
      published_at: post.published_at,
      author: post.author
    }))
  }
})

export const getBySlug = query({
  args: {
    slug: v.string()
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query('posts')
      .withIndex('by_slug', q => q.eq('slug', args.slug))
      .order('desc')
      .take(1)

    if (!post.length) {
      return null
    }

    const entry = post[0]!

    return {
      _id: entry._id,
      title: entry.title,
      description: entry.description,
      image: entry.image,
      slug: entry.slug,
      tags: entry.tags,
      published_at: entry.published_at,
      content: entry.content,
      author: entry.author
    }
  }
})

export const getForAdmin = query({
  args: {
    id: v.id('posts')
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id)

    if (!post) {
      return null
    }

    return {
      _id: post._id,
      title: post.title,
      description: post.description,
      image: post.image,
      slug: post.slug,
      status: post.status,
      tags: post.tags,
      published_at: post.published_at,
      content: post.content,
      author: post.author
    }
  }
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('posts')
      .withIndex('by_status_and_published_at', q => q.eq('status', 'published'))
      .order('desc')
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: results.page.map(post => ({
        _id: post._id,
        title: post.title,
        description: post.description,
        image: post.image,
        slug: post.slug,
        tags: post.tags,
        published_at: post.published_at,
        author: post.author
      }))
    }
  }
})

export const listForAdmin = query({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('posts')
      .withIndex('by_published_at')
      .order('desc')
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: results.page.map(post => ({
        _id: post._id,
        title: post.title,
        description: post.description,
        image: post.image,
        slug: post.slug,
        status: post.status,
        tags: post.tags,
        published_at: post.published_at,
        author: post.author
      }))
    }
  }
})

export const create = mutation({
  args: postInputValidator,
  handler: async (ctx, args) => {
    const existingPosts = await ctx.db
      .query('posts')
      .withIndex('by_slug', q => q.eq('slug', args.slug))
      .take(1)

    if (existingPosts.length) {
      throw new Error('A blog post with this slug already exists.')
    }

    const now = Date.now()

    return await ctx.db.insert('posts', {
      ...args,
      updated_at: now,
      last_updated: now
    })
  }
})

export const update = mutation({
  args: {
    id: v.id('posts'),
    ...postInputValidator
  },
  handler: async (ctx, args) => {
    const existingPost = await ctx.db.get(args.id)

    if (!existingPost) {
      throw new Error('This blog post could not be found.')
    }

    const slugMatches = await ctx.db
      .query('posts')
      .withIndex('by_slug', q => q.eq('slug', args.slug))
      .take(2)

    if (slugMatches.some(post => post._id !== args.id)) {
      throw new Error('A blog post with this slug already exists.')
    }

    const { id, ...updates } = args
    const now = Date.now()

    await ctx.db.patch(id, {
      ...updates,
      updated_at: now,
      last_updated: now
    })
  }
})

export const remove = mutation({
  args: {
    id: v.id('posts')
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id)

    if (!post) {
      throw new Error('This blog post could not be found.')
    }

    await ctx.db.delete(args.id)
  }
})
