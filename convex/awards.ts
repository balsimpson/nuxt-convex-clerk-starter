import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { sortBySortOrder, writeSortOrder } from './lib/sortOrder'

export const list = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 100, 200))
    const awards = await ctx.db
      .query('awards')
      .withIndex('by_sortOrder', q => q.gte('sortOrder', Number.MIN_SAFE_INTEGER))
      .take(limit)

    return sortBySortOrder(awards)
  }
})

export const create = mutation({
  args: {
    title: v.string(),
    organization: v.string(),
    projectName: v.optional(v.string()),
    category: v.optional(v.string()),
    result: v.optional(v.string()),
    year: v.number(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    featured: v.boolean(),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const [lastAward] = await ctx.db
      .query('awards')
      .withIndex('by_sortOrder', q => q.gte('sortOrder', Number.MIN_SAFE_INTEGER))
      .order('desc')
      .take(1)

    const id = await ctx.db.insert('awards', {
      ...args,
      sortOrder: (lastAward?.sortOrder ?? -1) + 1
    })
    const created = await ctx.db.get(id)

    if (!created) {
      throw new Error('Failed to load created award')
    }

    return created
  }
})

export const reorder = mutation({
  args: {
    ids: v.array(v.id('awards'))
  },
  handler: async (ctx, args) => {
    await writeSortOrder(ctx, args.ids)
    return null
  }
})
