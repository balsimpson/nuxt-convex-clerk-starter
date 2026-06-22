import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalQuery, mutation, query } from './_generated/server'

const settingsKey = 'contact-us'

const lineArrayValidator = v.array(v.string())

export type ContactSettings = {
  addressLines: string[]
  phoneNumbers: string[]
  emails: string[]
  officeHours: string[]
  updatedAt: number | null
}

const defaultContactSettings: ContactSettings = {
  addressLines: [
    '1/F, 35 Anjanappa Complex Hennur Main Road,',
    'Lingarajapuram',
    'Bangalore 560 084',
    'India'
  ],
  phoneNumbers: [
    '+91-80-25473922',
    '+91-80-25492856'
  ],
  emails: [
    'contact@sichrem.org',
    'msichrem@gmail.com'
  ],
  officeHours: [
    'Monday - Friday: 10.00am to 5.00pm',
    'Staff on Field Work - Office will be closed on Saturday'
  ],
  updatedAt: null
}

function cleanLines(lines: string[]) {
  return lines
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 20)
}

export const getSettings = query({
  args: {},
  handler: async (ctx): Promise<ContactSettings> => {
    const settings = await ctx.db
      .query('contactSettings')
      .withIndex('by_key', q => q.eq('key', settingsKey))
      .unique()

    if (!settings) {
      return defaultContactSettings
    }

    return {
      addressLines: settings.addressLines,
      phoneNumbers: settings.phoneNumbers,
      emails: settings.emails,
      officeHours: settings.officeHours,
      updatedAt: settings.updatedAt
    }
  }
})

export const updateSettings = mutation({
  args: {
    addressLines: lineArrayValidator,
    phoneNumbers: lineArrayValidator,
    emails: lineArrayValidator,
    officeHours: lineArrayValidator
  },
  handler: async (ctx, args) => {
    const updates = {
      addressLines: cleanLines(args.addressLines),
      phoneNumbers: cleanLines(args.phoneNumbers),
      emails: cleanLines(args.emails),
      officeHours: cleanLines(args.officeHours),
      updatedAt: Date.now()
    }

    const existing = await ctx.db
      .query('contactSettings')
      .withIndex('by_key', q => q.eq('key', settingsKey))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, updates)
      return null
    }

    await ctx.db.insert('contactSettings', {
      key: settingsKey,
      ...updates
    })

    return null
  }
})

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
