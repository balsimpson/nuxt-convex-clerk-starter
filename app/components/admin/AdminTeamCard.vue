<script setup lang="ts">
import type { Doc } from '../../../convex/_generated/dataModel'

const props = withDefaults(defineProps<{
  item: Doc<'teamMembers'>
  isSaving?: boolean
  isDeleting?: boolean
  showReorderControls?: boolean
}>(), {
  isSaving: false,
  isDeleting: false,
  showReorderControls: true
})

const emit = defineEmits<{
  edit: []
  delete: []
  moveUp: []
  moveDown: []
}>()

const contactCount = computed(() => {
  return [props.item.email, props.item.websiteUrl, props.item.linkedinUrl, props.item.instagramUrl].filter(Boolean).length
})
</script>

<template>
  <div
    class="team-card group flex items-start gap-3 rounded-lg border border-default/60 bg-background px-3 py-2 hover:border-default/80 hover:bg-elevated/30"
  >
    <UIcon
      v-if="showReorderControls"
      name="i-lucide-grip-vertical"
      :class="[
        'drag-handle h-4 w-4 shrink-0 select-none transition-colors duration-150',
        isSaving
          ? 'cursor-not-allowed text-muted/20'
          : 'cursor-grab text-muted/30 group-hover:text-muted/70 active:cursor-grabbing'
      ]"
    />

    <div class="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-default/60 bg-elevated/60">
      <img
        v-if="item.photoUrl"
        :src="item.photoUrl"
        :alt="item.name"
        class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
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
      <div class="flex items-baseline gap-2">
        <span class="truncate text-sm font-semibold text-highlighted">{{ item.name }}</span>
        <UBadge
          :color="item.active ? 'primary' : 'neutral'"
          variant="soft"
          class="shrink-0"
        >
          {{ item.active ? 'Active' : 'Inactive' }}
        </UBadge>
        <span class="shrink-0 text-xs text-muted">#{{ item.sortOrder }}</span>
      </div>

      <div class="flex items-center gap-x-2 text-xs text-muted">
        <span v-if="item.department">{{ item.department }}</span>
        <span
          v-if="item.department && item.role"
          class="text-default/30"
        >·</span>
        <span v-if="item.role">{{ item.role }}</span>
      </div>

      <p
        v-if="item.bio"
        class="mt-1 line-clamp-2 text-xs leading-5 text-muted"
      >
        {{ item.bio }}
      </p>

      <p class="mt-1 text-xs text-muted">
        {{ contactCount }} contact link{{ contactCount === 1 ? '' : 's' }}
      </p>
    </div>

    <div class="flex shrink-0 items-center gap-0.5">
      <UButton
        v-if="showReorderControls"
        icon="i-lucide-arrow-up"
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="isSaving"
        @click.stop="emit('moveUp')"
      />
      <UButton
        v-if="showReorderControls"
        icon="i-lucide-arrow-down"
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="isSaving"
        @click.stop="emit('moveDown')"
      />
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
.team-card {
  transition:
    background-color 160ms ease,
    border-color 160ms ease;
}
</style>
