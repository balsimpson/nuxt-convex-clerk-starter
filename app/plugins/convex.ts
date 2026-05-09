import { convexVue } from 'convex-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { convexUrl } } = useRuntimeConfig()
  const url = convexUrl || (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> }
  }).process?.env?.CONVEX_URL || ''

  if (!url) {
    throw new Error('Missing `CONVEX_URL` runtime configuration')
  }

  nuxtApp.vueApp.use(convexVue, {
    url
  })
})
