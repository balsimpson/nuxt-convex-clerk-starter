const env = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> }
}).process?.env

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'motion-v/nuxt',
    '@clerk/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    youtubeDataApiKey: env?.NUXT_YOUTUBE_DATA_API_KEY || env?.YOUTUBE_DATA_API_KEY || '',
    public: {
      convexUrl: env?.NUXT_PUBLIC_CONVEX_URL || env?.CONVEX_URL || ''
    }
  },

  compatibilityDate: '2025-01-15',

    vite: {
    optimizeDeps: {
      include: [
        // Prevent duplicate ProseMirror plugin instances in Nuxt UI's editor.
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
