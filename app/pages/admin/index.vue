<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useConvexMutation, useConvexQuery } from 'convex-vue'

definePageMeta({
  layout: 'admin'
})

const portfolioOpen = ref(false)
const awardOpen = ref(false)
const teamOpen = ref(false)
const teamEditItem = ref<Doc<'teamMembers'> | null>(null)
const teamDeletingId = ref<string | null>(null)

type RecentCardItem = {
  title: string
  subtitle: string
  createdAt: number
  href: string
  thumbnailUrl?: string
}

type RecentTeamCardItem = Doc<'teamMembers'> & {
  title: string
  subtitle: string
  createdAt: number
  href: string
}

const { data: recent, isPending, error } = useConvexQuery(api.admin.recentItems, {
  limit: 5
})

const { mutate: removeTeamMember } = useConvexMutation(api.teamMembers.remove)

const sections = computed(() => [
  {
    key: 'portfolio',
    title: 'Portfolio',
    description: 'Latest portfolio items.',
    addLabel: 'Add portfolio item',
    icon: 'i-lucide-briefcase-business',
    items: recent.value?.portfolio ?? [],
    emptyTitle: 'No portfolio items yet',
    emptyDescription: 'Add the first portfolio item to start building the list.'
  },
  {
    key: 'awards',
    title: 'Awards',
    description: 'Latest award records.',
    addLabel: 'Add award',
    icon: 'i-lucide-trophy',
    items: recent.value?.awards ?? [],
    emptyTitle: 'No awards yet',
    emptyDescription: 'Add the first award record to start the archive.'
  },
  {
    key: 'team',
    title: 'Team',
    description: 'Latest team records.',
    addLabel: 'Add team member',
    icon: 'i-lucide-users',
    items: recent.value?.team ?? [],
    emptyTitle: 'No team members yet',
    emptyDescription: 'Add the first team member to start the roster.'
  }
])

function openAction(action: string) {
  if (action === 'portfolio') {
    portfolioOpen.value = true
    return
  }

  if (action === 'award' || action === 'awards') {
    awardOpen.value = true
    return
  }

  teamOpen.value = true
}

function openTeamEdit(item: Doc<'teamMembers'>) {
  teamEditItem.value = item
  teamOpen.value = true
}

async function deleteTeamMember(item: Doc<'teamMembers'>) {
  if (teamDeletingId.value) return

  teamDeletingId.value = item._id

  try {
    await removeTeamMember({ id: item._id })
  } finally {
    teamDeletingId.value = null
  }
}

function asTeamMember(item: RecentCardItem | RecentTeamCardItem) {
  return item as Doc<'teamMembers'>
}

function getPortfolioThumbnail(item: RecentCardItem | RecentTeamCardItem) {
  return 'thumbnailUrl' in item ? item.thumbnailUrl : undefined
}

function formatCreatedAt(timestamp: number) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(timestamp)
}
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.28em] text-muted">
            Admin
          </p>
          <h1 class="text-3xl font-semibold tracking-[-0.04em] text-highlighted sm:text-4xl">
            Latest content
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-muted">
            Keep portfolio, awards, and team entries separate, with the latest five in each section.
          </p>
        </div>
      </div>

      <div class="py-8">
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error.message"
        />

        <div class="grid gap-4 lg:grid-cols-3">
          <UCard
            v-for="section in sections"
            :key="section.key"
            class="h-full"
          >
            <div class="flex h-full flex-col">
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-2">
                  <p class="text-xs uppercase tracking-[0.24em] text-muted">
                    Latest 5
                  </p>
                  <h2 class="text-lg font-semibold text-highlighted">
                    {{ section.title }}
                  </h2>
                  <p class="text-sm leading-6 text-muted">
                    {{ section.description }}
                  </p>
                </div>

                <UButton
                  :label="section.addLabel"
                  icon="i-lucide-plus"
                  color="primary"
                  size="sm"
                  @click="openAction(section.key)"
                />
              </div>

              <USeparator class="my-6" />

              <div
                v-if="isPending"
                class="space-y-4"
              >
                <div
                  v-for="index in 5"
                  :key="index"
                  class="flex items-start gap-4 rounded-2xl border border-default/60 p-4"
                >
                  <div class="h-10 w-10 rounded-2xl bg-elevated/70 animate-pulse" />
                  <div class="min-w-0 flex-1 space-y-2">
                    <div class="h-4 w-24 rounded bg-elevated/70 animate-pulse" />
                    <div class="h-5 w-2/3 rounded bg-elevated/70 animate-pulse" />
                    <div class="h-4 w-1/2 rounded bg-elevated/70 animate-pulse" />
                  </div>
                </div>
              </div>

              <div
                v-else-if="!section.items.length"
                class="flex min-h-56 flex-1 flex-col items-start gap-4 rounded-2xl border border-dashed border-default/70 bg-elevated/30 p-6"
              >
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UIcon
                    :name="section.icon"
                    class="h-6 w-6"
                  />
                </div>
                <div class="space-y-1">
                  <h3 class="text-base font-semibold text-highlighted">
                    {{ section.emptyTitle }}
                  </h3>
                  <p class="text-sm leading-6 text-muted">
                    {{ section.emptyDescription }}
                  </p>
                </div>
                <UButton
                  :label="section.addLabel"
                  icon="i-lucide-plus"
                  color="primary"
                  @click="openAction(section.key)"
                />
              </div>

              <div
                v-else
                class="space-y-3"
              >
                <template v-if="section.key === 'team'">
                  <AdminTeamCard
                    v-for="item in section.items"
                    :key="`${section.key}-${asTeamMember(item)._id}`"
                    :item="asTeamMember(item)"
                    :show-reorder-controls="false"
                    :is-deleting="teamDeletingId === asTeamMember(item)._id"
                    @edit="openTeamEdit(asTeamMember(item))"
                    @delete="deleteTeamMember(asTeamMember(item))"
                  />
                </template>

                <template v-else>
                  <NuxtLink
                    v-for="item in section.items"
                    :key="`${section.key}-${item.createdAt}-${item.title}`"
                    :to="item.href"
                    class="flex items-start gap-4 rounded-2xl border border-default/60 p-4 transition-colors hover:bg-elevated/40"
                  >
                    <div
                      v-if="section.key === 'portfolio'"
                      class="h-16 w-24 shrink-0 overflow-hidden rounded-2xl bg-elevated/40"
                    >
                      <img
                        v-if="getPortfolioThumbnail(item)"
                        :src="getPortfolioThumbnail(item) ?? ''"
                        :alt="item.title"
                        class="h-full w-full object-cover"
                      >

                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-muted"
                      >
                        Portfolio
                      </div>
                    </div>

                    <div
                      v-else
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                    >
                      {{ section.title.slice(0, 1) }}
                    </div>

                    <div class="min-w-0 flex-1 space-y-1">
                      <h3 class="truncate text-base font-semibold text-highlighted">
                        {{ item.title }}
                      </h3>
                      <p class="text-sm leading-6 text-muted">
                        {{ item.subtitle }}
                      </p>
                      <p class="text-xs text-muted">
                        Added {{ formatCreatedAt(item.createdAt) }}
                      </p>
                    </div>

                    <UIcon
                      name="i-lucide-arrow-up-right"
                      class="mt-1 h-5 w-5 text-muted"
                    />
                  </NuxtLink>
                </template>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <AdminCreatePortfolioModal v-model:open="portfolioOpen" />
    <AdminCreateAwardModal v-model:open="awardOpen" />
    <AdminCreateTeamModal
      v-model:open="teamOpen"
      :edit-item="teamEditItem"
    />
  </UPage>
</template>
