import { createError, getQuery } from 'h3'
import { fetchYouTubeVideoMetadata, extractYouTubeVideoId } from '~/lib/youtube'

export default defineEventHandler(async (event) => {
  const { youtubeDataApiKey } = useRuntimeConfig()
  const { url } = getQuery(event)

  if (!youtubeDataApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'YouTube Data API key is not configured'
    })
  }

  if (typeof url !== 'string' || !url.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A YouTube URL is required'
    })
  }

  const videoId = extractYouTubeVideoId(url)

  if (!videoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a valid YouTube URL'
    })
  }

  return await fetchYouTubeVideoMetadata(videoId, youtubeDataApiKey)
})
