import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('contactSubmissions', {
      name: args.name.trim(),
      email: args.email.trim(),
      phone: args.phone.trim(),
      subject: args.subject.trim(),
      message: args.message.trim(),
      createdAt: Date.now()
    })

    return null
  }
})
