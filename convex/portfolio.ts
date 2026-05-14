import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'
import { mutation, query } from './_generated/server'
import { sortBySortOrder, writeSortOrder } from './lib/sortOrder'

const optionalString = v.optional(v.string())
const optionalNumber = v.optional(v.number())

const createPortfolioArgs = {
  title: v.string(),
  slug: optionalString,
  videoUrl: v.string(),
  thumbnailUrl: optionalString,
  client: optionalString,
  productionHouse: optionalString,
  creativeHead: optionalString,
  agencyHead: optionalString,
  servicing: optionalString,
  executiveProducer: optionalString,
  associateProducer: optionalString,
  productionDesigner: optionalString,
  lineProducer: optionalString,
  juniorProducer: optionalString,
  productionManager: optionalString,
  associateDirector: optionalString,
  assistantDirectors: optionalString,
  modelCoordinators: optionalString,
  costumeStylist: optionalString,
  makeup: optionalString,
  hair: optionalString,
  firstAD: optionalString,
  secondAD: optionalString,
  firstAC: optionalString,
  focusPuller: optionalString,
  editor: optionalString,
  musicDirector: optionalString,
  di: optionalString,
  cg: optionalString,
  vfx: optionalString,
  colorist: optionalString,
  soundFxAndMixing: optionalString,
  assistantEditor: optionalString,
  postTeam: optionalString,
  account: optionalString,
  description: optionalString,
  category: optionalString,
  tags: v.array(v.string()),
  brand: optionalString,
  agency: optionalString,
  director: optionalString,
  dop: optionalString,
  producer: optionalString,
  year: optionalNumber,
  featured: v.boolean(),
  published: v.boolean(),
  sortOrder: v.number(),
  notes: optionalString
} as const

const updatePortfolioArgs = {
  id: v.id('portfolio'),
  title: optionalString,
  slug: optionalString,
  videoUrl: optionalString,
  thumbnailUrl: optionalString,
  client: optionalString,
  productionHouse: optionalString,
  creativeHead: optionalString,
  agencyHead: optionalString,
  servicing: optionalString,
  executiveProducer: optionalString,
  associateProducer: optionalString,
  productionDesigner: optionalString,
  lineProducer: optionalString,
  juniorProducer: optionalString,
  productionManager: optionalString,
  associateDirector: optionalString,
  assistantDirectors: optionalString,
  modelCoordinators: optionalString,
  costumeStylist: optionalString,
  makeup: optionalString,
  hair: optionalString,
  firstAD: optionalString,
  secondAD: optionalString,
  firstAC: optionalString,
  focusPuller: optionalString,
  editor: optionalString,
  musicDirector: optionalString,
  di: optionalString,
  cg: optionalString,
  vfx: optionalString,
  colorist: optionalString,
  soundFxAndMixing: optionalString,
  assistantEditor: optionalString,
  postTeam: optionalString,
  account: optionalString,
  description: optionalString,
  category: optionalString,
  tags: v.optional(v.array(v.string())),
  brand: optionalString,
  agency: optionalString,
  director: optionalString,
  dop: optionalString,
  producer: optionalString,
  year: optionalNumber,
  featured: v.optional(v.boolean()),
  published: v.optional(v.boolean()),
  sortOrder: optionalNumber,
  notes: optionalString
} as const

function normalizeSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'portfolio'
}

type SlugCtx = { db: QueryCtx['db'] } | { db: MutationCtx['db'] }

async function ensureUniqueSlug(
  ctx: SlugCtx,
  baseSlug: string,
  excludeId?: Id<'portfolio'>
) {
  const rootSlug = normalizeSlug(baseSlug)

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? rootSlug : `${rootSlug}-${suffix + 1}`
    const matches = await ctx.db
      .query('portfolio')
      .withIndex('by_slug', q => q.eq('slug', candidate))
      .take(2)

    if (!matches.some(doc => doc._id !== excludeId)) {
      return candidate
    }
  }

  throw new Error('Unable to generate a unique portfolio slug')
}

function sortPortfolioItems(items: Doc<'portfolio'>[]) {
  return sortBySortOrder(items)
}

export const list = query({
  args: {
    limit: v.optional(v.number()),
    publishedOnly: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 100, 200))

    if (args.publishedOnly) {
      const items = await ctx.db
        .query('portfolio')
        .withIndex('by_published_and_sortOrder', q => q.eq('published', true).gte('sortOrder', Number.MIN_SAFE_INTEGER))
        .take(limit)

      return sortPortfolioItems(items)
    }

    const items = await ctx.db
      .query('portfolio')
      .withIndex('by_sortOrder', q => q.gte('sortOrder', Number.MIN_SAFE_INTEGER))
      .take(limit)

    return sortPortfolioItems(items)
  }
})

export const listFeatured = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 20, 50))

    const items = await ctx.db
      .query('portfolio')
      .withIndex('by_featured_and_sortOrder', q => q.eq('featured', true).gte('sortOrder', Number.MIN_SAFE_INTEGER))
      .take(limit)

    // Only return published featured items
    return sortPortfolioItems(items.filter(item => item.published))
  }
})

export const reorder = mutation({
  args: {
    ids: v.array(v.id('portfolio'))
  },
  handler: async (ctx, args) => {
    await writeSortOrder(ctx, args.ids)
    return null
  }
})

export const get = query({
  args: {
    id: v.id('portfolio')
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  }
})

export const getBySlug = query({
  args: {
    slug: v.string()
  },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query('portfolio')
      .withIndex('by_slug', q => q.eq('slug', normalizeSlug(args.slug)))
      .take(2)

    if (matches.length > 1) {
      throw new Error(`Multiple portfolio items found for slug ${args.slug}`)
    }

    return matches[0] ?? null
  }
})

export const create = mutation({
  args: createPortfolioArgs,
  handler: async (ctx, args) => {
    const slug = await ensureUniqueSlug(ctx, args.slug ?? args.title)

    const id = await ctx.db.insert('portfolio', {
      title: args.title,
      slug,
      videoUrl: args.videoUrl,
      thumbnailUrl: args.thumbnailUrl,
      client: args.client,
      productionHouse: args.productionHouse,
      creativeHead: args.creativeHead,
      agencyHead: args.agencyHead,
      servicing: args.servicing,
      executiveProducer: args.executiveProducer,
      associateProducer: args.associateProducer,
      productionDesigner: args.productionDesigner,
      lineProducer: args.lineProducer,
      juniorProducer: args.juniorProducer,
      productionManager: args.productionManager,
      associateDirector: args.associateDirector,
      assistantDirectors: args.assistantDirectors,
      modelCoordinators: args.modelCoordinators,
      costumeStylist: args.costumeStylist,
      makeup: args.makeup,
      hair: args.hair,
      firstAD: args.firstAD,
      secondAD: args.secondAD,
      firstAC: args.firstAC,
      focusPuller: args.focusPuller,
      editor: args.editor,
      musicDirector: args.musicDirector,
      di: args.di,
      cg: args.cg,
      vfx: args.vfx,
      colorist: args.colorist,
      soundFxAndMixing: args.soundFxAndMixing,
      assistantEditor: args.assistantEditor,
      postTeam: args.postTeam,
      account: args.account,
      description: args.description,
      category: args.category,
      tags: args.tags,
      brand: args.brand,
      agency: args.agency,
      director: args.director,
      dop: args.dop,
      producer: args.producer,
      year: args.year,
      featured: args.featured,
      published: args.published,
      sortOrder: args.sortOrder,
      notes: args.notes
    })

    const created = await ctx.db.get(id)

    if (!created) {
      throw new Error('Failed to load created portfolio item')
    }

    return created
  }
})

export const update = mutation({
  args: updatePortfolioArgs,
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id)

    if (!existing) {
      throw new Error('Portfolio item not found')
    }

    const slugSource = args.slug ?? args.title ?? existing.slug
    const patch: Partial<Doc<'portfolio'>> = {}

    if (args.title !== undefined) patch.title = args.title
    if (args.videoUrl !== undefined) patch.videoUrl = args.videoUrl
    if (args.thumbnailUrl !== undefined) patch.thumbnailUrl = args.thumbnailUrl
    if (args.client !== undefined) patch.client = args.client
    if (args.productionHouse !== undefined) patch.productionHouse = args.productionHouse
    if (args.creativeHead !== undefined) patch.creativeHead = args.creativeHead
    if (args.agencyHead !== undefined) patch.agencyHead = args.agencyHead
    if (args.servicing !== undefined) patch.servicing = args.servicing
    if (args.executiveProducer !== undefined) patch.executiveProducer = args.executiveProducer
    if (args.associateProducer !== undefined) patch.associateProducer = args.associateProducer
    if (args.productionDesigner !== undefined) patch.productionDesigner = args.productionDesigner
    if (args.lineProducer !== undefined) patch.lineProducer = args.lineProducer
    if (args.juniorProducer !== undefined) patch.juniorProducer = args.juniorProducer
    if (args.productionManager !== undefined) patch.productionManager = args.productionManager
    if (args.associateDirector !== undefined) patch.associateDirector = args.associateDirector
    if (args.assistantDirectors !== undefined) patch.assistantDirectors = args.assistantDirectors
    if (args.modelCoordinators !== undefined) patch.modelCoordinators = args.modelCoordinators
    if (args.costumeStylist !== undefined) patch.costumeStylist = args.costumeStylist
    if (args.makeup !== undefined) patch.makeup = args.makeup
    if (args.hair !== undefined) patch.hair = args.hair
    if (args.firstAD !== undefined) patch.firstAD = args.firstAD
    if (args.secondAD !== undefined) patch.secondAD = args.secondAD
    if (args.firstAC !== undefined) patch.firstAC = args.firstAC
    if (args.focusPuller !== undefined) patch.focusPuller = args.focusPuller
    if (args.editor !== undefined) patch.editor = args.editor
    if (args.musicDirector !== undefined) patch.musicDirector = args.musicDirector
    if (args.di !== undefined) patch.di = args.di
    if (args.cg !== undefined) patch.cg = args.cg
    if (args.vfx !== undefined) patch.vfx = args.vfx
    if (args.colorist !== undefined) patch.colorist = args.colorist
    if (args.soundFxAndMixing !== undefined) patch.soundFxAndMixing = args.soundFxAndMixing
    if (args.assistantEditor !== undefined) patch.assistantEditor = args.assistantEditor
    if (args.postTeam !== undefined) patch.postTeam = args.postTeam
    if (args.account !== undefined) patch.account = args.account
    if (args.description !== undefined) patch.description = args.description
    if (args.category !== undefined) patch.category = args.category
    if (args.tags !== undefined) patch.tags = args.tags
    if (args.brand !== undefined) patch.brand = args.brand
    if (args.agency !== undefined) patch.agency = args.agency
    if (args.director !== undefined) patch.director = args.director
    if (args.dop !== undefined) patch.dop = args.dop
    if (args.producer !== undefined) patch.producer = args.producer
    if (args.year !== undefined) patch.year = args.year
    if (args.featured !== undefined) patch.featured = args.featured
    if (args.published !== undefined) patch.published = args.published
    if (args.sortOrder !== undefined) patch.sortOrder = args.sortOrder
    if (args.notes !== undefined) patch.notes = args.notes

    patch.slug = await ensureUniqueSlug(ctx, slugSource, args.id)

    await ctx.db.patch(args.id, patch)

    const updated = await ctx.db.get(args.id)

    if (!updated) {
      throw new Error('Failed to load updated portfolio item')
    }

    return updated
  }
})

export const remove = mutation({
  args: {
    id: v.id('portfolio')
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id)

    if (!existing) {
      throw new Error('Portfolio item not found')
    }

    await ctx.db.delete(args.id)

    return existing
  }
})
