<script setup lang="ts">
import type { TeamListItem } from '../../../convex/team'

const props = withDefaults(defineProps<{
  item: TeamListItem
  isDeleting?: boolean
  showHandle?: boolean
}>(), {
  isDeleting: false,
  showHandle: true
})

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="team-card group flex items-start gap-4 py-4 transition-colors hover:bg-elevated/30">
    <button
      v-if="props.showHandle"
      type="button"
      class="team-drag-handle mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-highlighted"
      aria-label="Drag to reorder"
    >
      <UIcon
        name="i-lucide-grip-vertical"
        class="h-4 w-4"
      />
    </button>

    <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#8f6240] bg-[#ead6bf]">
      <img
        v-if="props.item.imageUrl"
        :src="props.item.imageUrl"
        :alt="props.item.fullname"
        class="h-full w-full scale-[1.18] object-cover object-center transition-transform duration-300 group-hover:scale-[1.22]"
      >
      <div
        v-else
        class="flex h-full w-full items-center justify-center"
      >
        <UIcon
          name="i-lucide-user"
          class="h-4 w-4 text-muted/40"
        />
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <span class="truncate text-base font-semibold text-highlighted">{{ props.item.fullname }}</span>

      <div class="mt-1 text-sm text-muted">
        {{ props.item.designation }}
      </div>

      <p
        v-if="props.item.bio"
        class="mt-2 line-clamp-3 text-sm leading-6 text-muted"
      >
        {{ props.item.bio }}
      </p>
    </div>

    <div class="flex shrink-0 items-center gap-0.5">
      <UButton
        icon="i-lucide-pencil"
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="props.isDeleting"
        @click.stop="emit('edit')"
      />
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="xs"
        :loading="props.isDeleting"
        :disabled="props.isDeleting"
        @click.stop="emit('delete')"
      />
    </div>
  </div>
</template>
