import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  portfolio: defineTable({
    title: v.string(),
    slug: v.string(),
    videoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    client: v.optional(v.string()),
    productionHouse: v.optional(v.string()),
    executiveProducer: v.optional(v.string()),
    associateProducer: v.optional(v.string()),
    productionDesigner: v.optional(v.string()),
    lineProducer: v.optional(v.string()),
    juniorProducer: v.optional(v.string()),
    costumeStylist: v.optional(v.string()),
    makeup: v.optional(v.string()),
    hair: v.optional(v.string()),
    firstAD: v.optional(v.string()),
    secondAD: v.optional(v.string()),
    firstAC: v.optional(v.string()),
    focusPuller: v.optional(v.string()),
    editor: v.optional(v.string()),
    musicDirector: v.optional(v.string()),
    vfx: v.optional(v.string()),
    colorist: v.optional(v.string()),
    soundFxAndMixing: v.optional(v.string()),
    assistantEditor: v.optional(v.string()),
    postTeam: v.optional(v.string()),
    account: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.array(v.string()),
    brand: v.optional(v.string()),
    agency: v.optional(v.string()),
    director: v.optional(v.string()),
    dop: v.optional(v.string()),
    producer: v.optional(v.string()),
    year: v.optional(v.number()),
    featured: v.boolean(),
    published: v.boolean(),
    sortOrder: v.number(),
    notes: v.optional(v.string())
  })
    .index('by_slug', ['slug'])
    .index('by_sortOrder', ['sortOrder'])
    .index('by_published_and_sortOrder', ['published', 'sortOrder'])
    .index('by_featured_and_sortOrder', ['featured', 'sortOrder'])
    .index('by_client_and_sortOrder', ['client', 'sortOrder'])
    .index('by_productionHouse_and_sortOrder', ['productionHouse', 'sortOrder'])
    .index('by_brand_and_sortOrder', ['brand', 'sortOrder'])
    .index('by_year_and_sortOrder', ['year', 'sortOrder']),

  awards: defineTable({
    title: v.string(),
    organization: v.string(),
    projectName: v.optional(v.string()),
    category: v.optional(v.string()),
    result: v.optional(v.string()),
    year: v.number(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    featured: v.boolean(),
    sortOrder: v.number(),
    notes: v.optional(v.string())
  })
    .index('by_sortOrder', ['sortOrder'])
    .index('by_year_and_sortOrder', ['year', 'sortOrder'])
    .index('by_featured_and_sortOrder', ['featured', 'sortOrder'])
    .index('by_organization_and_year', ['organization', 'year']),

  teamMembers: defineTable({
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
    sortOrder: v.number(),
    notes: v.optional(v.string())
  })
    .index('by_sortOrder', ['sortOrder'])
    .index('by_active', ['active'])
    .index('by_role', ['role'])
    .index('by_department', ['department'])
})
