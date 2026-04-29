<template>
    <UHeader>
        <template #left>
            <NuxtLink to="/">
                <AppLogo class="w-auto h-6 shrink-0" />
            </NuxtLink>

            <TemplateMenu />
        </template>

        <template #right>
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
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
</template>