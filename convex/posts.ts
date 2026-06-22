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

function extractFirstMarkdownImage(content: unknown) {
  if (typeof content !== 'string') return ''

  const match = content.match(/!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/i)

  return (match?.[1] ?? match?.[2] ?? '').trim()
}

function markdownToPlainText(value: unknown) {
  if (typeof value !== 'string') return ''

  return value
    .replace(/!\[[^\]]*\]\(\s*(?:<[^>]+>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g, ' ')
    .replace(/\[([^\]]+)\]\(\s*(?:<[^>]+>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g, '$1')
    .replace(/^```[^\n]*|```$/gm, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-*+]\s+|\d+\.\s+)/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/([*_~])([^\n]+?)\1/g, '$2')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function displayFields(post: { title: string, description: string, image: string, content: unknown }) {
  const contentDescription = markdownToPlainText(post.content)

  return {
    description: markdownToPlainText(post.description) || contentDescription.slice(0, 180).trim() || post.title.trim(),
    image: extractFirstMarkdownImage(post.content) || post.image.trim()
  }
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

    return posts.map((post) => {
      const fields = displayFields(post)

      return {
        _id: post._id,
        title: post.title,
        description: fields.description,
        image: fields.image,
        slug: post.slug,
        tags: post.tags,
        published_at: post.published_at,
        author: post.author
      }
    })
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
    const fields = displayFields(entry)

    return {
      _id: entry._id,
      title: entry.title,
      description: fields.description,
      image: fields.image,
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

    const fields = displayFields(post)

    return {
      _id: post._id,
      title: post.title,
      description: fields.description,
      image: fields.image,
      slug: post.slug,
      status: post.status,
      tags: post.tags,
      published_at: post.published_at,
      content: post.content,
      author: post.author
    }
  }
})

export const getById = query({
  args: {
    id: v.id('posts')
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id)

    if (!post) {
      return null
    }

    const fields = displayFields(post)

    return {
      _id: post._id,
      title: post.title,
      description: fields.description,
      excerpt: fields.description,
      category: '',
      image: fields.image,
      slug: post.slug,
      status: post.status,
      publishStatus: post.status,
      contentType: post.status,
      tags: post.tags,
      published_at: post.published_at,
      originalSource: '',
      originalPublishedAt: post.published_at ? new Date(post.published_at as string).getTime() : null,
      updatedAt: post.updated_at ?? post.last_updated ?? post._creationTime,
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
      page: results.page.map((post) => {
        const fields = displayFields(post)

        return {
          _id: post._id,
          title: post.title,
          description: fields.description,
          image: fields.image,
          slug: post.slug,
          tags: post.tags,
          published_at: post.published_at,
          author: post.author
        }
      })
    }
  }
})

export const listForAdmin = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const searchQuery = args.searchQuery?.trim()
    const results = searchQuery
      ? await ctx.db
          .query('posts')
          .withSearchIndex('search_title', q => q.search('title', searchQuery))
          .paginate(args.paginationOpts)
      : await ctx.db
          .query('posts')
          .withIndex('by_published_at')
          .order('desc')
          .paginate(args.paginationOpts)

    return {
      ...results,
      page: results.page.map((post) => {
        const fields = displayFields(post)

        return {
          _id: post._id,
          title: post.title,
          description: fields.description,
          image: fields.image,
          slug: post.slug,
          status: post.status,
          tags: post.tags,
          published_at: post.published_at,
          author: post.author
        }
      })
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
    const fields = displayFields(args)

    return await ctx.db.insert('posts', {
      ...args,
      description: fields.description,
      image: fields.image,
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
    const fields = displayFields(updates)

    await ctx.db.patch(id, {
      ...updates,
      description: fields.description,
      image: fields.image,
      updated_at: now,
      last_updated: now
    })
  }
})

export const upsert = mutation({
  args: {
    id: v.optional(v.id('posts')),
    title: v.optional(v.string()),
    slug: v.string(),
    content: v.optional(v.any()),
    contentType: v.optional(v.string()),
    publishStatus: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    originalSource: v.optional(v.string()),
    originalPublishedAt: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const status = args.publishStatus ?? args.contentType ?? 'draft'
    const title = args.title?.trim() || 'Untitled'
    const slug = args.slug.trim() || 'untitled'
    const description = markdownToPlainText(args.excerpt) || markdownToPlainText(args.content).slice(0, 180).trim() || title
    const image = extractFirstMarkdownImage(args.content) || args.image?.trim() || ''
    const now = Date.now()
    const publishedAt = args.originalPublishedAt ? new Date(args.originalPublishedAt).toISOString() : new Date(now).toISOString()

    const existingPosts = await ctx.db
      .query('posts')
      .withIndex('by_slug', q => q.eq('slug', slug))
      .take(2)

    if (existingPosts.some(post => post._id !== args.id)) {
      throw new Error('A blog post with this slug already exists.')
    }

    const post = {
      title,
      description,
      image,
      slug,
      status,
      content: args.content ?? '',
      tags: args.tags ?? [],
      published_at: publishedAt,
      updated_at: now,
      last_updated: now,
      author: {
        name: 'Manasa',
        email: '',
        photo: '',
        uid: ''
      }
    }

    if (args.id) {
      const existingPost = await ctx.db.get(args.id)

      if (!existingPost) {
        throw new Error('This blog post could not be found.')
      }

      await ctx.db.patch(args.id, {
        ...post,
        author: existingPost.author
      })

      return {
        _id: args.id,
        slug,
        contentType: status,
        updatedAt: now
      }
    }

    const id = await ctx.db.insert('posts', post)

    return {
      _id: id,
      slug,
      contentType: status,
      updatedAt: now
    }
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
