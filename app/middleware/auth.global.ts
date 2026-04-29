// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isLoaded, isSignedIn } = useAuth()

  const publicRoutes = ['/sign-in']

  if (!isLoaded.value) return

  if (publicRoutes.includes(to.path)) return

  if (!isSignedIn.value) {
    return navigateTo('/sign-in')
  }
})