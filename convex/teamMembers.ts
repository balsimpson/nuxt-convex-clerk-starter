import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { sortBySortOrder, writeSortOrder } from './lib/sortOrder'

export const list = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 100, 200))
    const teamMembers = await ctx.db
      .query('teamMembers')
      .withIndex('by_sortOrder', q => q.gte('sortOrder', Number.MIN_SAFE_INTEGER))
      .take(limit)

    return sortBySortOrder(teamMembers)
  }
})

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    department: v.optional(v.string()),
    active: v.boolean(),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const [lastTeamMember] = await ctx.db
      .query('teamMembers')
      .withIndex('by_sortOrder', q => q.gte('sortOrder', Number.MIN_SAFE_INTEGER))
      .order('desc')
      .take(1)

    const id = await ctx.db.insert('teamMembers', {
      ...args,
      sortOrder: (lastTeamMember?.sortOrder ?? -1) + 1
    })
    const created = await ctx.db.get(id)

    if (!created) {
      throw new Error('Failed to load created team member')
    }

    return created
  }
})

export const update = mutation({
  args: {
    id: v.id('teamMembers'),
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    department: v.optional(v.string()),
    active: v.boolean(),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id)

    if (!existing) {
      throw new Error('Team member not found')
    }

    const patch: Partial<Doc<'teamMembers'>> = {
      name: args.name,
      role: args.role,
      active: args.active
    }

    if (args.bio !== undefined) patch.bio = args.bio
    if (args.photoUrl !== undefined) patch.photoUrl = args.photoUrl
    if (args.email !== undefined) patch.email = args.email
    if (args.websiteUrl !== undefined) patch.websiteUrl = args.websiteUrl
    if (args.linkedinUrl !== undefined) patch.linkedinUrl = args.linkedinUrl
    if (args.instagramUrl !== undefined) patch.instagramUrl = args.instagramUrl
    if (args.department !== undefined) patch.department = args.department
    if (args.notes !== undefined) patch.notes = args.notes

    await ctx.db.patch(args.id, patch)

    const updated = await ctx.db.get(args.id)

    if (!updated) {
      throw new Error('Failed to load updated team member')
    }

    return updated
  }
})

export const reorder = mutation({
  args: {
    ids: v.array(v.id('teamMembers'))
  },
  handler: async (ctx, args) => {
    await writeSortOrder(ctx, args.ids)
    return null
  }
})

export const remove = mutation({
  args: {
    id: v.id('teamMembers')
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id)

    if (!existing) {
      throw new Error('Team member not found')
    }

    await ctx.db.delete(args.id)

    return existing
  }
})
