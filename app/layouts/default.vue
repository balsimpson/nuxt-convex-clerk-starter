<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

    </template>

    <template #right>
      <UButton color="neutral" variant="soft" icon="i-lucide-log-out" class="shrink-0" @click="handleLogout">
        Sign out
      </UButton>
      <UColorModeButton />

      <UButton to="https://github.com/nuxt-ui-templates/starter" target="_blank" icon="i-simple-icons-github"
        aria-label="GitHub" color="neutral" variant="ghost" />
    </template>
  </UHeader>

  <main class="flex-1 pb-28 md:pb-0 min-h-[calc(100vh-6rem-env(safe-area-inset-bottom))] ">
    <slot />
  </main>


  <USeparator icon="i-simple-icons-nuxtdotjs" />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Built with Nuxt UI • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton to="https://github.com/nuxt-ui-templates/starter" target="_blank" icon="i-simple-icons-github"
        aria-label="GitHub" color="neutral" variant="ghost" />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const clerk = useClerk()
const handleLogout = async () => {
  if (!confirm('Are you sure you want to log out?')) return
  await clerk.value?.signOut()
  await navigateTo('/sign-in')
}
</script>