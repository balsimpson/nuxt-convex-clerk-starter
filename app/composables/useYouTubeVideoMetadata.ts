import { extractYouTubeVideoId, type YouTubeVideoMetadata } from '~/lib/youtube'

type UseYouTubeVideoMetadataOptions = {
  endpoint?: string
}

export function useYouTubeVideoMetadata(options: UseYouTubeVideoMetadataOptions = {}) {
  const endpoint = options.endpoint ?? '/api/youtube-metadata'
  const data = ref<YouTubeVideoMetadata | null>(null)
  const pending = ref(false)
  const error = ref<Error | null>(null)
  const cache = new Map<string, YouTubeVideoMetadata>()
  let requestId = 0

  async function lookup(url: string) {
    const normalizedUrl = url.trim()
    const videoId = extractYouTubeVideoId(normalizedUrl)

    if (!normalizedUrl || !videoId) {
      data.value = null
      error.value = null
      return null
    }

    const cached = cache.get(videoId)

    if (cached) {
      data.value = cached
      error.value = null
      pending.value = false
      return cached
    }

    const currentRequest = ++requestId

    pending.value = true
    error.value = null

    try {
      const result = await $fetch<YouTubeVideoMetadata>(endpoint, {
        query: { url: normalizedUrl }
      })

      if (currentRequest !== requestId) {
        return null
      }

      cache.set(result.videoId, result)

      data.value = result

      return result
    } catch (cause) {
      if (currentRequest === requestId) {
        data.value = null
        error.value = cause instanceof Error ? cause : new Error('Failed to load YouTube metadata')
      }

      return null
    } finally {
      if (currentRequest === requestId) {
        pending.value = false
      }
    }
  }

  function clear() {
    requestId += 1
    data.value = null
    error.value = null
    pending.value = false
  }

  function lookupCached(url: string) {
    const normalizedUrl = url.trim()
    const videoId = extractYouTubeVideoId(normalizedUrl)

    if (!normalizedUrl || !videoId) {
      return null
    }

    return cache.get(videoId) ?? null
  }

  return {
    data,
    pending,
    error,
    lookup,
    clear,
    lookupCached
  }
}
