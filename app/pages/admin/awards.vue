<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useConvexMutation, useConvexQuery } from 'convex-vue'
import { useSortableRecords } from '~/composables/useSortableRecords'

definePageMeta({
  layout: 'admin'
})

const awardOpen = ref(false)

const overview = [
  {
    label: 'Archive role',
    value: 'Awards'
  },
  {
    label: 'Primary lens',
    value: 'Records'
  },
  {
    label: 'Best use',
    value: 'Reorder awards'
  }
]

const { data: awardItems, isPending, error } = useConvexQuery(api.awards.list, {
  limit: 200
})

const { mutate: reorderAwards } = useConvexMutation(api.awards.reorder)

const {
  items: awardRecords,
  draggingId: awardDraggingId,
  dropTargetId: awardDropTargetId,
  isSaving: awardIsSaving,
  errorMessage: awardSortError,
  startDrag: startAwardDrag,
  dragOver: hoverAwardDrag,
  drop: dropAwardDrag,
  endDrag: endAwardDrag,
  moveUp: moveAwardUp,
  moveDown: moveAwardDown,
  canMoveUp: canAwardMoveUp,
  canMoveDown: canAwardMoveDown
} = useSortableRecords<Doc<'awards'>>(
  () => awardItems.value ?? [],
  ids => reorderAwards({ ids })
)

const displayError = computed(() => error.value?.message || awardSortError.value || '')

function awardContext(item: Doc<'awards'>) {
  return item.projectName ?? item.category ?? item.result ?? 'Award record'
}
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <UPageHeader
        headline="Admin"
        title="Awards"
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
                Awards archive
              </p>
              <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                Award records.
              </h2>
              <p class="max-w-2xl text-sm leading-6 text-muted">
                Reorder the awards list by dragging cards or using the arrow controls.
              </p>
            </div>

            <UButton
              label="Add award"
              icon="i-lucide-plus"
              color="primary"
              @click="awardOpen = true"
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
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <UCard
            v-for="index in 3"
            :key="index"
          >
            <div class="space-y-4 animate-pulse">
              <div class="h-4 w-24 rounded bg-elevated/70" />
              <div class="h-6 w-3/4 rounded bg-elevated/70" />
              <div class="h-4 w-full rounded bg-elevated/70" />
              <div class="h-4 w-5/6 rounded bg-elevated/70" />
            </div>
          </UCard>
        </div>

        <AdminEmptyState
          v-else-if="!awardRecords.length"
          title="No awards yet"
          description="Create the first award record, then drag cards to set the display order."
          icon="i-lucide-trophy"
          action-label="Add award"
          @action="awardOpen = true"
        />

        <div
          v-else
          class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <UCard
            v-for="item in awardRecords"
            :key="item._id"
            draggable="true"
            :class="[
              'transition-all duration-200',
              awardDraggingId === item._id ? 'scale-[0.99] opacity-60' : '',
              awardDropTargetId === item._id ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-transparent' : ''
            ]"
            @dragstart="startAwardDrag(item._id)"
            @dragover.prevent="hoverAwardDrag(item._id)"
            @drop.prevent="dropAwardDrag(item._id)"
            @dragend="endAwardDrag"
          >
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <p class="text-xs uppercase tracking-[0.24em] text-muted">
                    {{ awardContext(item) }}
                  </p>
                  <h2 class="text-lg font-semibold text-highlighted">
                    {{ item.title }}
                  </h2>
                </div>

                <div class="flex shrink-0 items-center gap-2">
                  <UBadge
                    color="neutral"
                    variant="soft"
                  >
                    #{{ item.sortOrder }}
                  </UBadge>

                  <UBadge
                    v-if="item.featured"
                    color="primary"
                    variant="soft"
                  >
                    Featured
                  </UBadge>

                  <UButton
                    icon="i-lucide-arrow-up"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :disabled="awardIsSaving || !canAwardMoveUp(item._id)"
                    @click.stop="moveAwardUp(item._id)"
                  />

                  <UButton
                    icon="i-lucide-arrow-down"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :disabled="awardIsSaving || !canAwardMoveDown(item._id)"
                    @click.stop="moveAwardDown(item._id)"
                  />

                  <UButton
                    icon="i-lucide-grip-vertical"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    draggable="true"
                    :disabled="awardIsSaving"
                    aria-label="Drag to reorder"
                    class="cursor-grab active:cursor-grabbing"
                    @dragstart.stop="startAwardDrag(item._id)"
                    @dragend.stop="endAwardDrag"
                  />
                </div>
              </div>

              <div class="grid gap-3 text-sm text-muted">
                <div class="flex items-center justify-between gap-4">
                  <span class="font-medium text-highlighted">Organization</span>
                  <span class="text-right">{{ item.organization }}</span>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <span class="font-medium text-highlighted">Year</span>
                  <span>{{ item.year }}</span>
                </div>

                <div
                  v-if="item.result"
                  class="flex items-center justify-between gap-4"
                >
                  <span class="font-medium text-highlighted">Result</span>
                  <span class="text-right">{{ item.result }}</span>
                </div>

                <div
                  v-if="item.projectName"
                  class="flex items-center justify-between gap-4"
                >
                  <span class="font-medium text-highlighted">Project</span>
                  <span class="text-right">{{ item.projectName }}</span>
                </div>
              </div>

              <p
                v-if="item.description"
                class="text-sm leading-6 text-muted"
              >
                {{ item.description }}
              </p>

              <div
                v-if="item.link"
                class="text-xs text-muted"
              >
                Link: {{ item.link }}
              </div>

              <p class="text-xs text-muted">
                Sort order: {{ item.sortOrder }}
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <AdminCreateAwardModal v-model:open="awardOpen" />
  </UPage>
</template>
