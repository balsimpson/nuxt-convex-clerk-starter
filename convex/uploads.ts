import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  }
})

export const saveImage = mutation({
  args: {
    storageId: v.id('_storage'),
    filename: v.optional(v.string()),
    contentType: v.optional(v.string()),
    size: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId)

    if (!url) {
      throw new Error('Uploaded image could not be found.')
    }

    return {
      storageId: args.storageId,
      filename: args.filename ?? null,
      contentType: args.contentType ?? null,
      size: args.size ?? null,
      url
    }
  }
})
