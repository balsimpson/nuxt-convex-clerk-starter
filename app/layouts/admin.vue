<script setup lang="ts">
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
  }
]
</script>

<template>
  <UDashboardGroup
    storage-key="manasa-admin"
    class="min-h-screen bg-[#f7efe2] text-[#2f2118]"
  >
    <UDashboardSidebar
      collapsible
      resizable
      :default-size="18"
      :min-size="14"
      :max-size="22"
      class="border-[#d9c9b7]/80 bg-[#f7efe2]"
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
            <p class="mt-1 truncate text-xs text-[#756453]">
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
        <UButton
          to="/"
          label="Open site"
          icon="i-lucide-arrow-right"
          color="neutral"
          variant="soft"
          :block="!collapsed"
          :square="collapsed"
          class="justify-center"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel class="min-w-0">
      <UDashboardNavbar
        title="Admin"
        class="border-[#d9c9b7]/80 bg-[#f7efe2]/92 backdrop-blur-xl lg:hidden"
      >
        <template #right>
          <UBadge
            color="neutral"
            variant="soft"
          >
            CMS
          </UBadge>
        </template>
      </UDashboardNavbar>

      <main class="min-w-0">
        <slot />
      </main>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
