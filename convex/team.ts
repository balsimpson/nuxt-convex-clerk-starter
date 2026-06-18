import type { Id } from './_generated/dataModel'
import { v } from 'convex/values'
import { mutation, query, type MutationCtx } from './_generated/server'

export type TeamCategory = 'Board Member' | 'Staff' | 'Co-ordinator' | 'Founder' | 'Executive Director'

export type TeamListItem = {
  _id: Id<'team'>
  _creationTime: number
  sortOrder: number
  fullname: string
  designation: string
  bio: string
  category: TeamCategory
  imageStorageId?: Id<'_storage'>
  imageUrl: string
}

const categoryValidator = v.union(
  v.literal('Board Member'),
  v.literal('Staff'),
  v.literal('Co-ordinator'),
  v.literal('Founder'),
  v.literal('Executive Director')
)

const teamFields = {
  fullname: v.string(),
  designation: v.string(),
  bio: v.string(),
  imageStorageId: v.optional(v.id('_storage')),
  category: categoryValidator
} as const

function normalizeSortOrder(item: { sortOrder?: number, _creationTime: number }) {
  return item.sortOrder ?? item._creationTime
}

function sortTeamItems<T extends { sortOrder?: number, _creationTime: number }>(items: readonly T[]) {
  return [...items].sort((a, b) => normalizeSortOrder(a) - normalizeSortOrder(b) || a._creationTime - b._creationTime)
}

async function getNextSortOrder(ctx: MutationCtx, category: TeamCategory) {
  const items = await ctx.db
    .query('team')
    .withIndex('by_category', q => q.eq('category', category))
    .take(100)

  return sortTeamItems(items).reduce((max, item) => Math.max(max, normalizeSortOrder(item)), 0) + 1
}

export const list = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(Math.floor(args.limit ?? 50), 1), 100)
    const items = await ctx.db.query('team').order('asc').take(limit)

    return await Promise.all(sortTeamItems(items).map(async (item): Promise<TeamListItem> => ({
      _id: item._id,
      _creationTime: item._creationTime,
      sortOrder: normalizeSortOrder(item),
      fullname: item.fullname,
      designation: item.designation,
      bio: item.bio,
      category: item.category,
      imageStorageId: item.imageStorageId,
      imageUrl: item.imageStorageId ? (await ctx.storage.getUrl(item.imageStorageId)) ?? '' : ''
    })))
  }
})

export const listByCategory = query({
  args: {
    category: categoryValidator,
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(Math.floor(args.limit ?? 50), 1), 100)
    const items = await ctx.db
      .query('team')
      .withIndex('by_category', q => q.eq('category', args.category))
      .order('asc')
      .take(limit)

    return await Promise.all(sortTeamItems(items).map(async (item): Promise<TeamListItem> => ({
      _id: item._id,
      _creationTime: item._creationTime,
      sortOrder: normalizeSortOrder(item),
      fullname: item.fullname,
      designation: item.designation,
      bio: item.bio,
      category: item.category,
      imageStorageId: item.imageStorageId,
      imageUrl: item.imageStorageId ? (await ctx.storage.getUrl(item.imageStorageId)) ?? '' : ''
    })))
  }
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  }
})

export const create = mutation({
  args: teamFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert('team', {
      ...args,
      sortOrder: await getNextSortOrder(ctx, args.category)
    })
  }
})

export const update = mutation({
  args: {
    id: v.id('team'),
    ...teamFields
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Team member not found')

    const categoryChanged = existing.category !== args.category
    const sortOrder = categoryChanged ? await getNextSortOrder(ctx, args.category) : existing.sortOrder ?? existing._creationTime

    await ctx.db.patch(args.id, {
      fullname: args.fullname,
      designation: args.designation,
      bio: args.bio,
      ...(args.imageStorageId !== undefined ? { imageStorageId: args.imageStorageId } : {}),
      category: args.category,
      sortOrder
    })

    if (args.imageStorageId && existing.imageStorageId && existing.imageStorageId !== args.imageStorageId) {
      await ctx.storage.delete(existing.imageStorageId)
    }
    return null
  }
})

export const reorder = mutation({
  args: {
    category: categoryValidator,
    ids: v.array(v.id('team'))
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('team')
      .withIndex('by_category', q => q.eq('category', args.category))
      .take(100)

    const itemById = new Map(items.map(item => [item._id, item]))

    if (args.ids.length !== itemById.size) {
      throw new Error('Team list changed while reordering')
    }

    for (const [index, id] of args.ids.entries()) {
      const item = itemById.get(id)
      if (!item) {
        throw new Error('Team list changed while reordering')
      }

      if (item.category !== args.category) {
        throw new Error('Team member category mismatch')
      }

      await ctx.db.patch(id, {
        sortOrder: index + 1
      })
    }

    return null
  }
})

export const remove = mutation({
  args: {
    id: v.id('team')
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id)
    if (existing?.imageStorageId) {
      await ctx.storage.delete(existing.imageStorageId)
    }

    await ctx.db.delete(args.id)
    return null
  }
})
