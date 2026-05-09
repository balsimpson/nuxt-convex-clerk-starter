export default defineNuxtRouteMiddleware((to) => {
  const { isLoaded, isSignedIn } = useAuth()

  const isAdminRoute = to.path === '/admin' || to.path.startsWith('/admin/')

  if (!isLoaded.value) return

  if (!isAdminRoute) return

  if (!isSignedIn.value) {
    return navigateTo('/sign-in')
  }
})
