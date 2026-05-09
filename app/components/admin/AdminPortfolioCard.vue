<script setup lang="ts">
import type { Doc } from '../../../convex/_generated/dataModel'

defineProps<{
  item: Doc<'portfolio'>
  isSaving?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div
    class="portfolio-card group flex items-start gap-3 rounded-lg border border-default/60 bg-background px-3 py-2 hover:border-default/80 hover:bg-elevated/30"
  >
    <!-- Drag handle -->
    <UIcon
      name="i-lucide-grip-vertical"
      :class="[
        'drag-handle h-4 w-4 shrink-0 select-none transition-colors duration-150',
        isSaving
          ? 'cursor-not-allowed text-muted/20'
          : 'cursor-grab text-muted/30 group-hover:text-muted/70 active:cursor-grabbing'
      ]"
    />

    <!-- Thumbnail -->
    <div class="h-10 w-16 shrink-0 overflow-hidden rounded bg-elevated/60">
      <img
        v-if="item.thumbnailUrl"
        :src="item.thumbnailUrl"
        :alt="item.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      >
      <div
        v-else
        class="flex h-full w-full items-center justify-center"
      >
        <UIcon
          name="i-lucide-film"
          class="h-4 w-4 text-muted/40"
        />
      </div>
    </div>

    <!-- Title + meta -->
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline gap-2">
        <span class="text-sm font-semibold text-highlighted">{{ item.title }}</span>
        <span
          v-if="item.year"
          class="shrink-0 text-xs text-muted"
        >{{ item.year }}</span>
      </div>
      <div class="flex items-center gap-x-2 text-xs text-muted">
        <span v-if="item.client || item.brand">{{ item.client || item.brand }}</span>
        <span
          v-if="(item.client || item.brand) && item.director"
          class="text-default/30"
        >·</span>
        <span v-if="item.director">Dir. {{ item.director }}</span>
        <span
          v-if="item.category && !item.client && !item.brand && !item.director"
          class="opacity-70"
        >{{ item.category }}</span>
      </div>
    </div>

    <!-- Icon action buttons -->
    <div class="flex shrink-0 items-center gap-0.5">
      <UButton
        icon="i-lucide-pencil"
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="isSaving || isDeleting"
        @click.stop="emit('edit')"
      />
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="xs"
        :loading="isDeleting"
        :disabled="isSaving || isDeleting"
        @click.stop="emit('delete')"
      />
    </div>
  </div>
</template>

<style scoped>
.portfolio-card {
  transition:
    background-color 160ms ease,
    border-color 160ms ease;
}
</style>
