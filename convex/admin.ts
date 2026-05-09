import { query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'

type RecentItemKind = 'portfolio' | 'award' | 'team'

type RecentItem = {
  kind: RecentItemKind
  title: string
  subtitle: string
  createdAt: number
  href: string
  thumbnailUrl?: string
}

type RecentTeamItem = Doc<'teamMembers'> & {
  kind: 'team'
  title: string
  subtitle: string
  createdAt: number
  href: string
}

function extractYouTubeVideoId(input: string) {
  const value = input.trim()

  if (!value) return null

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()

    if (host === 'youtu.be') {
      const candidate = url.pathname.split('/').filter(Boolean)[0]

      if (candidate?.length === 11) {
        return candidate
      }
    }

    if (host.endsWith('youtube.com')) {
      const searchId = url.searchParams.get('v')

      if (searchId?.length === 11) {
        return searchId
      }

      const pathMatch = url.pathname.match(/\/(?:shorts|embed|v)\/([\w-]{11})/i)

      if (pathMatch?.[1]) {
        return pathMatch[1]
      }
    }
  } catch {
    // Fall back to pattern matching for pasted text and partial URLs.
  }

  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|v\/))([\w-]{11})/i)
  return match?.[1] ?? null
}

function buildYouTubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

export const recentItems = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 5, 20))

    const [portfolioItems, awards, teamMembers] = await Promise.all([
      ctx.db.query('portfolio').order('desc').take(limit),
      ctx.db.query('awards').order('desc').take(limit),
      ctx.db.query('teamMembers').order('desc').take(limit)
    ])

    const portfolio: RecentItem[] = portfolioItems.map(item => ({
      kind: 'portfolio' as const,
      title: item.title,
      subtitle: item.client ?? item.brand ?? item.category ?? 'Portfolio item',
      createdAt: item._creationTime,
      href: '/admin/portfolio',
      thumbnailUrl: item.thumbnailUrl ?? (() => {
        const videoId = extractYouTubeVideoId(item.videoUrl)
        return videoId ? buildYouTubeThumbnailUrl(videoId) : undefined
      })()
    }))

    const awardsList: RecentItem[] = awards.map(item => ({
      kind: 'award' as const,
      title: item.title,
      subtitle: item.organization,
      createdAt: item._creationTime,
      href: '/admin/awards'
    }))

    const team: RecentTeamItem[] = teamMembers.map(item => ({
      ...item,
      kind: 'team' as const,
      title: item.name,
      subtitle: item.role,
      createdAt: item._creationTime,
      href: '/admin/team'
    }))

    return {
      portfolio: portfolio.slice(0, limit),
      awards: awardsList.slice(0, limit),
      team: team.slice(0, limit)
    }
  }
})
