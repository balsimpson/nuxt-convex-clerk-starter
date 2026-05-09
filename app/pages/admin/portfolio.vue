<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useConvexMutation, useConvexQuery } from 'convex-vue'
import { useSortableRecords } from '~/composables/useSortableRecords'
import draggable from 'vuedraggable'

definePageMeta({
  layout: 'admin'
})

const portfolioOpen = ref(false)
const editItem = ref<Doc<'portfolio'> | null>(null)
const deletingId = ref<string | null>(null)

const summary = [
  { label: 'Collection', value: 'Portfolio items' },
  { label: 'Primary action', value: 'Reorder items' },
  { label: 'Sorting logic', value: 'Sort order' }
]

const { data: portfolioItems, isPending, error } = useConvexQuery(api.portfolio.list, {
  limit: 200
})

const { mutate: reorderPortfolio } = useConvexMutation(api.portfolio.reorder)
const { mutate: removePortfolio } = useConvexMutation(api.portfolio.remove)

const {
  items: portfolioRecords,
  isSaving: portfolioIsSaving,
  errorMessage: portfolioSortError
} = useSortableRecords<Doc<'portfolio'>>(
  () => portfolioItems.value ?? [],
  ids => reorderPortfolio({ ids })
)

const displayError = computed(() => error.value?.message || portfolioSortError.value || '')

// Local copy for vuedraggable v-model (stays in sync with canonical list when not dragging)
const localRecords = ref<Doc<'portfolio'>[]>([])
watch(
  portfolioRecords,
  (val) => {
    localRecords.value = [...val]
  },
  { immediate: true }
)

async function onDragEnd() {
  const ids = localRecords.value.map(i => i._id)
  const canonicalIds = portfolioRecords.value.map(i => i._id)
  if (ids.join() !== canonicalIds.join()) {
    await reorderPortfolio({ ids })
  }
}

function openEdit(item: Doc<'portfolio'>) {
  editItem.value = item
  portfolioOpen.value = true
}

function openCreate() {
  editItem.value = null
  portfolioOpen.value = true
}

async function handleDelete(item: Doc<'portfolio'>) {
  if (deletingId.value) return
  deletingId.value = item._id
  try {
    await removePortfolio({ id: item._id })
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
        title="Portfolio"
        :links="[
          { label: 'Back to admin', to: '/admin', color: 'neutral', variant: 'outline' }
        ]"
      />

      <div class="space-y-6 py-8">
        <UCard>
          <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-muted">
                Portfolio index
              </p>
              <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                Portfolio items.
              </h2>
              <p class="max-w-2xl text-sm leading-6 text-muted">
                Reorder the portfolio by dragging rows. Use the edit button to update an item or delete to remove it.
              </p>
            </div>
            <UButton
              label="New portfolio item"
              icon="i-lucide-plus"
              color="primary"
              @click="openCreate"
            />
          </div>

          <USeparator class="my-6" />

          <div class="grid gap-3 sm:grid-cols-3">
            <UCard
              v-for="item in summary"
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

        <!-- Loading skeleton -->
        <div
          v-if="isPending"
          class="space-y-1.5"
        >
          <div
            v-for="index in 8"
            :key="index"
            class="flex animate-pulse items-center gap-3 rounded-lg border border-default/40 px-3 py-2"
          >
            <div class="h-4 w-4 rounded bg-elevated/70" />
            <div class="h-14 w-20 rounded bg-elevated/70" />
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 w-40 rounded bg-elevated/70" />
              <div class="h-3 w-24 rounded bg-elevated/70" />
            </div>
          </div>
        </div>

        <AdminEmptyState
          v-else-if="!portfolioRecords.length"
          title="No portfolio items yet"
          description="Add the first portfolio item, then drag rows to set the display order."
          icon="i-lucide-briefcase-business"
          action-label="Add portfolio item"
          @action="openCreate"
        />

        <!-- Portfolio list -->
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
            :disabled="portfolioIsSaving"
            tag="div"
            class="space-y-1"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <AdminPortfolioCard
                :key="element._id"
                :item="element"
                :is-saving="portfolioIsSaving"
                :is-deleting="deletingId === element._id"
                @edit="openEdit(element)"
                @delete="handleDelete(element)"
              />
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <AdminCreatePortfolioModal
      v-model:open="portfolioOpen"
      :edit-item="editItem"
    />
  </UPage>
</template>

<style scoped>
</style>
