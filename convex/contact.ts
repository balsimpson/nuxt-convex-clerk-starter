import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalQuery, mutation } from './_generated/server'

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string()
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert('contactSubmissions', {
      name: args.name.trim(),
      email: args.email.trim(),
      phone: args.phone.trim(),
      subject: args.subject.trim(),
      message: args.message.trim(),
      createdAt: Date.now()
    })

    await ctx.scheduler.runAfter(0, internal.contactEmail.sendSubmissionAlert, {
      submissionId
    })

    return null
  }
})

export const getSubmissionForAlert = internalQuery({
  args: {
    submissionId: v.id('contactSubmissions')
  },
  handler: async (ctx, args) => {
    return await ctx.db.get('contactSubmissions', args.submissionId)
  }
})
