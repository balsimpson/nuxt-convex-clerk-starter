<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { TeamCategory, TeamListItem } from '../../../convex/team'
import { useConvexMutation } from 'convex-vue'

definePageMeta({
  layout: 'admin'
})

const teamOpen = ref(false)
const editItem = ref<TeamListItem | null>(null)
const createCategory = ref<TeamCategory | null>(null)
const deletingId = ref<string | null>(null)

const { mutate: removeTeamMember } = useConvexMutation(api.team.remove)

const teamCategorySections = [
  {
    category: 'Founder',
    title: 'Founder'
  },
  {
    category: 'Executive Director',
    title: 'Executive Director'
  },
  {
    category: 'Board Member',
    title: 'Board Members',
    createLabel: 'Add board member'
  },
  {
    category: 'Staff',
    title: 'Staff',
    createLabel: 'Add staff'
  },
  {
    category: 'Co-ordinator',
    title: 'Coordinators',
    createLabel: 'Add coordinator'
  }
] satisfies Array<{
  category: TeamCategory
  title: string
  createLabel?: string
}>

function openEdit(item: TeamListItem) {
  editItem.value = item
  createCategory.value = null
  teamOpen.value = true
}

function openCreate(category: TeamCategory = 'Board Member') {
  editItem.value = null
  createCategory.value = category
  teamOpen.value = true
}

async function handleDelete(item: TeamListItem) {
  if (deletingId.value) return

  deletingId.value = item._id

  try {
    await removeTeamMember({ id: item._id })
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <UPageHeader
        headline="Admin"
        title="Team"
        :links="[
          {
            label: 'Back to admin',
            to: '/admin',
            color: 'neutral',
            variant: 'outline'
          }
        ]"
      />

      <div class="py-8">
        <section class="border-y border-default">
          <div class="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-muted">
                Team roster
              </p>
              <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                Team records
              </h2>
              <p class="max-w-2xl text-sm leading-6 text-muted">
                Create, edit, and remove team members in separate category tables, ordered by oldest creation date first.
              </p>
            </div>

            <UButton
              label="Add team member"
              icon="i-lucide-plus"
              color="primary"
              @click="openCreate()"
            />
          </div>

          <div class="divide-y divide-default border-t border-default">
            <AdminTeamCategoryTable
              v-for="section in teamCategorySections"
              :key="section.category"
              :category="section.category"
              :title="section.title"
              :create-label="section.createLabel"
              :deleting-id="deletingId"
              @edit="openEdit"
              @delete="handleDelete"
              @create="openCreate(section.category)"
            />
          </div>
        </section>
      </div>
    </div>

    <AdminCreateTeamModal
      v-model:open="teamOpen"
      :edit-item="editItem"
      :category="createCategory"
    />
  </UPage>
</template>
