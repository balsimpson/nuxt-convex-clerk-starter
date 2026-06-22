import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    description: v.string(),
    image: v.string(),
    slug: v.string(),
    status: v.string(),
    content: v.any(),
    tags: v.array(v.string()),
    published_at: v.any(),
    updated_at: v.optional(v.any()),
    last_updated: v.optional(v.any()),
    author: v.object({
      name: v.string(),
      email: v.string(),
      photo: v.string(),
      uid: v.string()
    })
  })
    .index('by_slug', ['slug'])
    .index('by_status_and_published_at', ['status', 'published_at'])
    .index('by_status_and_updated_at', ['status', 'updated_at'])
    .index('by_published_at', ['published_at'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['status']
    }),
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string(),
    createdAt: v.number()
  }),
  contactSettings: defineTable({
    key: v.string(),
    addressLines: v.array(v.string()),
    phoneNumbers: v.array(v.string()),
    emails: v.array(v.string()),
    officeHours: v.array(v.string()),
    updatedAt: v.number()
  }).index('by_key', ['key']),
  team: defineTable({
    fullname: v.string(),
    designation: v.string(),
    bio: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    sortOrder: v.optional(v.number()),
    category: v.union(
      v.literal('Board Member'),
      v.literal('Staff'),
      v.literal('Co-ordinator'),
      v.literal('Founder'),
      v.literal('Executive Director')
    )
  }).index('by_category', ['category'])
})
