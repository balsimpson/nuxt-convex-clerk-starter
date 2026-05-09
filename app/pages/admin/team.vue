<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useConvexMutation, useConvexQuery } from 'convex-vue'
import { useSortableRecords } from '~/composables/useSortableRecords'
import draggable from 'vuedraggable'

definePageMeta({
  layout: 'admin'
})

const teamOpen = ref(false)
const editItem = ref<Doc<'teamMembers'> | null>(null)
const deletingId = ref<string | null>(null)

const overview = [
  {
    label: 'Roster focus',
    value: 'Roles'
  },
  {
    label: 'Primary view',
    value: 'Team list'
  },
  {
    label: 'Best use',
    value: 'Reorder people'
  }
]

const { data: teamItems, isPending, error } = useConvexQuery(api.teamMembers.list, {
  limit: 200
})

const { mutate: reorderTeam } = useConvexMutation(api.teamMembers.reorder)
const { mutate: removeTeamMember } = useConvexMutation(api.teamMembers.remove)

const {
  items: teamRecords,
  isSaving: teamIsSaving,
  errorMessage: teamSortError,
  moveUp: moveTeamUp,
  moveDown: moveTeamDown
} = useSortableRecords<Doc<'teamMembers'>>(
  () => teamItems.value ?? [],
  ids => reorderTeam({ ids })
)

const localRecords = ref<Doc<'teamMembers'>[]>([])
watch(
  teamRecords,
  (val) => {
    localRecords.value = [...val]
  },
  { immediate: true }
)

async function onDragEnd() {
  const ids = localRecords.value.map(item => item._id)
  const canonicalIds = teamRecords.value.map(item => item._id)

  if (ids.join() !== canonicalIds.join()) {
    await reorderTeam({ ids })
  }
}

const displayError = computed(() => error.value?.message || teamSortError.value || '')

function openEdit(item: Doc<'teamMembers'>) {
  editItem.value = item
  teamOpen.value = true
}

function openCreate() {
  editItem.value = null
  teamOpen.value = true
}

async function handleDelete(item: Doc<'teamMembers'>) {
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

      <div class="space-y-6 py-8">
        <UCard>
          <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-muted">
                Team roster
              </p>
              <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                Team records.
              </h2>
              <p class="max-w-2xl text-sm leading-6 text-muted">
                Reorder the team list by dragging cards or using the arrow controls.
              </p>
            </div>

            <UButton
              label="Add team member"
              icon="i-lucide-plus"
              color="primary"
              @click="openCreate"
            />
          </div>

          <USeparator class="my-6" />

          <div class="grid gap-3 sm:grid-cols-3">
            <UCard
              v-for="item in overview"
              :key="item.label"
              variant="subtle"
            >
              <p class="text-xs uppercase tracking-[0.24em] text-muted">
                {{ item.label }}
              </p>
              <p class="mt-2 text-sm font-medium text-highlighted">
                {{ item.value }}
              </p>
            </UCard>
          </div>
        </UCard>

        <UAlert
          v-if="displayError"
          color="error"
          variant="soft"
          :title="displayError"
        />

        <div
          v-if="isPending"
          class="space-y-1.5"
        >
          <div
            v-for="index in 3"
            :key="index"
            class="flex animate-pulse items-start gap-3 rounded-lg border border-default/40 px-3 py-2"
          >
            <div class="h-12 w-12 rounded-2xl bg-elevated/70" />
            <div class="min-w-0 flex-1 space-y-2">
              <div class="h-4 w-24 rounded bg-elevated/70" />
              <div class="h-5 w-3/4 rounded bg-elevated/70" />
              <div class="h-4 w-full rounded bg-elevated/70" />
            </div>
          </div>
        </div>

        <AdminEmptyState
          v-else-if="!teamRecords.length"
          title="No team members yet"
          description="Add the first team member, then drag cards to set the roster order."
          icon="i-lucide-users"
          action-label="Add team member"
          @action="openCreate"
        />

        <div
          v-else
          class="space-y-1"
        >
          <draggable
            v-if="localRecords.length"
            v-model="localRecords"
            item-key="_id"
            handle=".drag-handle"
            ghost-class="drag-ghost-slot"
            drag-class="drag-floating"
            animation="200"
            :disabled="teamIsSaving"
            tag="div"
            class="space-y-1"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <AdminTeamCard
                :key="element._id"
                :item="element"
                :is-saving="teamIsSaving"
                :is-deleting="deletingId === element._id"
                @edit="openEdit(element)"
                @delete="handleDelete(element)"
                @move-up="moveTeamUp(element._id)"
                @move-down="moveTeamDown(element._id)"
              />
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <AdminCreateTeamModal
      v-model:open="teamOpen"
      :edit-item="editItem"
    />
  </UPage>
</template>
