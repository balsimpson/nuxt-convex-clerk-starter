<script setup lang="ts">
const { user } = useUser()
const clerk = useClerk()

const navItems = [
  {
    label: 'Overview',
    to: '/admin',
    icon: 'i-lucide-layout-grid'
  },
  {
    label: 'Team',
    to: '/admin/team',
    icon: 'i-lucide-users'
  },
  {
    label: 'Contact',
    to: '/admin/contact',
    icon: 'i-lucide-contact'
  }
]

const displayName = computed(() => {
  const fullName = user.value?.fullName?.trim()

  if (fullName) return fullName

  const firstName = user.value?.firstName?.trim()
  const lastName = user.value?.lastName?.trim()
  const name = [firstName, lastName].filter(Boolean).join(' ')

  if (name) return name

  return user.value?.primaryEmailAddress?.emailAddress ?? 'Account'
})

const handleSignOut = async () => {
  await clerk.value?.signOut()
  await navigateTo('/')
}
</script>

<template>
  <UDashboardGroup
    storage-key="manasa-admin"
    class="bg-[#fbf7ef] text-[#2f2118]"
  >
    <UDashboardSidebar
      collapsible
      resizable
      :default-size="18"
      :min-size="14"
      :max-size="22"
      class="border-[#d9c9b7]/80 bg-[#fbf7ef]"
      :ui="{
        header: 'border-b border-[#d9c9b7]/80 p-4',
        body: 'gap-4 p-3',
        footer: 'border-t border-[#d9c9b7]/80 p-3'
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink
          to="/admin"
          class="flex min-w-0 items-center gap-3"
          aria-label="Manasa admin overview"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
            <img
              src="/manasa-logo-copy.png"
              alt="Manasa logo"
              class="h-full w-full object-contain"
            >
          </div>

          <div
            v-if="!collapsed"
            class="min-w-0"
          >
            <p class="font-serif text-lg leading-none text-[#2f2118]">
              Manasa
            </p>
            <p class="mt-1 truncate text-xs text-[#4f4134]">
              Admin
            </p>
          </div>
        </NuxtLink>
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        color="primary"
        variant="pill"
        :collapsed="false"
        class="w-full"
      />

      <template #footer="{ collapsed }">
        <div class="space-y-2">
          <p
            v-if="!collapsed"
            class="truncate text-sm font-medium text-[#2f2118]"
          >
            {{ displayName }}
          </p>

          <UButton
            color="primary"
            variant="soft"
            :label="collapsed ? undefined : 'Sign out'"
            icon="i-lucide-log-out"
            :title="displayName"
            :block="!collapsed"
            :square="collapsed"
            class="justify-center"
            @click="handleSignOut"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel
      class="min-w-0 bg-[#fbf7ef]"
      :ui="{ body: 'min-w-0 bg-[#fbf7ef] p-0 sm:p-0' }"
    >
      <template #header>
        <UDashboardNavbar
          title="Admin"
          class="border-[#d9c9b7]/80 bg-[#fbf7ef]/92 backdrop-blur-xl lg:hidden"
        >
          <template #right>
            <UBadge
              color="primary"
              variant="soft"
            >
              CMS
            </UBadge>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
