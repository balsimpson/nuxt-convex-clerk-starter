export interface YouTubeVideoMetadata {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  channelTitle?: string
  authorUrl?: string
}

type YouTubeVideoApiResponse = {
  items?: Array<{
    snippet?: {
      title?: string
      description?: string
      channelTitle?: string
    }
  }>
}

const youtubeVideoPatterns = [
  /youtu\.be\/([\w-]{11})/i,
  /youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})/i,
  /youtube\.com\/shorts\/([\w-]{11})/i,
  /youtube\.com\/embed\/([\w-]{11})/i,
  /youtube\.com\/v\/([\w-]{11})/i
]

export function extractYouTubeVideoId(input: string) {
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

  for (const pattern of youtubeVideoPatterns) {
    const match = value.match(pattern)

    if (match?.[1]) {
      return match[1]
    }
  }

  return null
}

export function buildYouTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function buildYouTubeThumbnailUrl(
  videoId: string,
  quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'maxresdefault'
) {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

export async function fetchYouTubeVideoMetadata(
  videoId: string,
  apiKey: string,
  fetchImpl: typeof fetch = globalThis.fetch
) {
  const response = await fetchImpl(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`
  )

  if (!response.ok) {
    throw new Error(`YouTube API request failed with status ${response.status}`)
  }

  const payload = await response.json() as YouTubeVideoApiResponse
  const snippet = payload.items?.[0]?.snippet

  if (!snippet?.title) {
    throw new Error('YouTube video not found')
  }

  return {
    videoId,
    title: snippet.title,
    description: snippet.description ?? '',
    thumbnailUrl: buildYouTubeThumbnailUrl(videoId),
    videoUrl: buildYouTubeWatchUrl(videoId),
    channelTitle: snippet.channelTitle
  } satisfies YouTubeVideoMetadata
}

export async function resolveYouTubeVideoMetadata(
  input: string,
  apiKey: string,
  fetchImpl: typeof fetch = globalThis.fetch
) {
  const videoId = extractYouTubeVideoId(input)

  if (!videoId) {
    return null
  }

  return await fetchYouTubeVideoMetadata(videoId, apiKey, fetchImpl)
}
