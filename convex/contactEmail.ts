'use node'

import nodemailer from 'nodemailer'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import { internalAction } from './_generated/server'

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required Convex environment variable: ${name}`)
  }

  return value
}

export const sendSubmissionAlert = internalAction({
  args: {
    submissionId: v.id('contactSubmissions')
  },
  handler: async (ctx, args): Promise<null> => {
    const submission: Doc<'contactSubmissions'> | null = await ctx.runQuery(
      internal.contact.getSubmissionForAlert,
      { submissionId: args.submissionId }
    )

    if (!submission) {
      throw new Error(`Contact submission ${args.submissionId} was not found`)
    }

    const gmailUser = getRequiredEnvironmentVariable('GMAIL_USER')
    const gmailAppPassword = getRequiredEnvironmentVariable('GMAIL_APP_PASSWORD')
    const alertEmail = getRequiredEnvironmentVariable('CONTACT_ALERT_EMAIL')
    const messageLines = [
      'A new message was submitted through the Manasa website.',
      '',
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || 'Not provided'}`
    ]

    if (submission.subject) {
      messageLines.push(`Subject: ${submission.subject}`)
    }

    messageLines.push('', 'Message:', submission.message)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    })

    await transporter.sendMail({
      from: `Manasa Website <${gmailUser}>`,
      to: alertEmail,
      replyTo: submission.email,
      subject: 'New Manasa website contact message',
      text: messageLines.join('\n')
    })

    return null
  }
})
