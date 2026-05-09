<script setup lang="ts">
const route = useRoute()

const navItems = [
  {
    label: 'Overview',
    to: '/admin',
    icon: 'i-lucide-layout-grid',
    description: 'Latest content at a glance'
  },
  {
    label: 'Portfolio',
    to: '/admin/portfolio',
    icon: 'i-lucide-briefcase-business',
    description: 'Edit and reorder portfolio items'
  },
  {
    label: 'Awards',
    to: '/admin/awards',
    icon: 'i-lucide-trophy',
    description: 'Manage award records'
  },
  {
    label: 'Team',
    to: '/admin/team',
    icon: 'i-lucide-users',
    description: 'Maintain the team roster'
  }
]

function isActive(path: string) {
  if (path === '/admin') {
    return route.path === '/admin'
  }

  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,0.02),_transparent)]">
    <div class="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <aside class="hidden w-80 shrink-0 lg:block">
        <div class="sticky top-6 space-y-4">
          <UCard class="overflow-hidden">
            <div class="space-y-4 p-5">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.28em] text-muted">
                    Admin shell
                  </p>
                  <h1 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-highlighted">
                    Navigation
                  </h1>
                </div>

                <UBadge
                  color="neutral"
                  variant="soft"
                >
                  CMS
                </UBadge>
              </div>

              <p class="text-sm leading-6 text-muted">
                Switch between admin sections without losing context.
              </p>
            </div>

            <USeparator />

            <nav class="space-y-1 p-3">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="group flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors"
                :class="isActive(item.to) ? 'bg-primary/10 text-primary ring-1 ring-primary/15' : 'hover:bg-elevated/50 text-default'"
              >
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors"
                  :class="isActive(item.to) ? 'bg-primary/15 text-primary' : 'bg-elevated/70 text-muted group-hover:text-default'"
                >
                  <UIcon
                    :name="item.icon"
                    class="h-5 w-5"
                  />
                </div>

                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex items-center justify-between gap-3">
                    <p class="truncate text-sm font-medium">
                      {{ item.label }}
                    </p>

                    <UIcon
                      name="i-lucide-arrow-up-right"
                      class="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>

                  <p class="text-xs leading-5 text-muted">
                    {{ item.description }}
                  </p>
                </div>
              </NuxtLink>
            </nav>
          </UCard>

          <UCard class="border border-default/60 bg-elevated/30">
            <div class="space-y-2 p-5">
              <p class="text-xs uppercase tracking-[0.24em] text-muted">
                Shortcut
              </p>
              <p class="text-sm leading-6 text-muted">
                Use the section menu to jump directly to content workflows.
              </p>
              <UButton
                to="/"
                label="Open site"
                icon="i-lucide-arrow-right"
                color="neutral"
                variant="soft"
                block
                class="mt-3"
              />
            </div>
          </UCard>
        </div>
      </aside>

      <main class="min-w-0 flex-1 space-y-4">
        <UCard class="lg:hidden">
          <div class="space-y-4 p-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-muted">
                  Admin shell
                </p>
                <h1 class="mt-1 text-xl font-semibold tracking-[-0.03em] text-highlighted">
                  Navigation
                </h1>
              </div>

              <UBadge
                color="neutral"
                variant="soft"
              >
                CMS
              </UBadge>
            </div>

            <div class="flex gap-2 overflow-x-auto pb-1">
              <UButton
                v-for="item in navItems"
                :key="`mobile-${item.to}`"
                :to="item.to"
                :label="item.label"
                :icon="item.icon"
                :color="isActive(item.to) ? 'primary' : 'neutral'"
                :variant="isActive(item.to) ? 'soft' : 'ghost'"
                size="sm"
                class="shrink-0"
              />
            </div>
          </div>
        </UCard>

        <slot />
      </main>
    </div>
  </div>
</template>
