<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { TeamCategory, TeamListItem } from '../../../convex/team'
import Draggable from 'vuedraggable'
import { useConvexMutation, useConvexQuery } from 'convex-vue'

const sortTeamItems = (items: readonly TeamListItem[] | undefined) => {
  return [...(items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder || a._creationTime - b._creationTime)
}

const props = defineProps<{
  category: TeamCategory
  title: string
  createLabel?: string
  deletingId?: string | null
}>()

const emit = defineEmits<{
  edit: [item: TeamListItem]
  delete: [item: TeamListItem]
  create: []
}>()

const items = ref<TeamListItem[]>([])
const previousItems = ref<TeamListItem[]>([])

const { data: teamItems, isPending, error } = useConvexQuery(api.team.listByCategory, {
  category: props.category,
  limit: 100
})

const { mutate: reorderTeamMembers, isPending: reorderIsPending, error: reorderError } = useConvexMutation(api.team.reorder)

const isSortableCategory = computed(() => !['Founder', 'Executive Director'].includes(props.category))

watch(teamItems, (value) => {
  items.value = sortTeamItems(value)
}, { immediate: true })

function handleDragStart() {
  previousItems.value = [...items.value]
}

async function handleDragChange(event: { moved?: { oldIndex: number, newIndex: number } }) {
  if (!event.moved) return

  const ids = items.value.map(item => item._id)

  try {
    await reorderTeamMembers({
      category: props.category,
      ids
    })
  } catch {
    items.value = previousItems.value.length ? [...previousItems.value] : sortTeamItems(teamItems.value)
  }
}

const displayError = computed(() => error.value?.message || reorderError.value?.message || '')
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <h3 class="truncate text-xl font-semibold tracking-[-0.03em] text-highlighted">
          {{ title }}
        </h3>
        <UBadge
          color="neutral"
          variant="soft"
        >
          {{ teamItems?.length || 0 }}
        </UBadge>
      </div>

      <UButton
        v-if="createLabel"
        :label="createLabel"
        icon="i-lucide-plus"
        color="primary"
        variant="outline"
        size="xs"
        @click="emit('create')"
      />
    </div>

    <UAlert
      v-if="displayError"
      class="mt-4"
      color="error"
      variant="soft"
      :title="displayError"
    />

    <div
      v-else-if="isPending"
      class="mt-4 space-y-4"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="animate-pulse border-t border-default/50 py-4 first:border-t-0 first:pt-0"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <div class="h-12 w-12 shrink-0 rounded-2xl bg-elevated/70" />
            <div class="min-w-0 flex-1 space-y-2">
              <div class="h-4 w-28 rounded bg-elevated/70" />
              <div class="h-3 w-20 rounded bg-elevated/70" />
            </div>
          </div>
          <div class="h-8 w-20 rounded bg-elevated/70 sm:ml-4 sm:justify-self-end" />
        </div>
      </div>
    </div>

    <div
      v-else
      class="mt-4 space-y-3"
    >
      <div class="flex items-center justify-between gap-3 text-xs text-muted">
        <p>Drag the grip to reorder this category.</p>
        <p v-if="reorderIsPending">
          Saving order...
        </p>
      </div>

      <Draggable
        v-if="isSortableCategory"
        v-model="items"
        item-key="_id"
        handle=".team-drag-handle"
        :animation="180"
        ghost-class="team-ghost"
        chosen-class="team-chosen"
        :disabled="reorderIsPending"
        class="space-y-3"
        @start="handleDragStart"
        @change="handleDragChange"
      >
        <template #item="{ element }">
          <AdminTeamCard
            :item="element"
            :is-deleting="deletingId === element._id"
            :show-handle="true"
            @edit="emit('edit', element)"
            @delete="emit('delete', element)"
          />
        </template>
      </Draggable>

      <div
        v-else
        class="space-y-3"
      >
        <AdminTeamCard
          v-for="element in items"
          :key="element._id"
          :item="element"
          :is-deleting="deletingId === element._id"
          :show-handle="false"
          @edit="emit('edit', element)"
          @delete="emit('delete', element)"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped>
:deep(.team-ghost) {
  opacity: 0.35;
}

:deep(.team-chosen) {
  transform: scale(1.01);
  box-shadow: 0 12px 30px rgba(47, 33, 24, 0.12);
}
</style>
