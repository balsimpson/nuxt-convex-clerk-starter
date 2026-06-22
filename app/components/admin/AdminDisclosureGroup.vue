<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description?: string
  defaultOpen?: boolean
}>(), {
  defaultOpen: false
})

const open = ref(props.defaultOpen)
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <p class="text-sm font-medium text-highlighted">
          {{ title }}
        </p>

        <p
          v-if="description"
          class="text-sm text-muted"
        >
          {{ description }}
        </p>
      </div>

      <UButton
        :icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        :label="open ? 'Hide' : 'Show'"
        color="primary"
        variant="ghost"
        size="sm"
        @click="open = !open"
      />
    </div>

    <div
      v-if="open"
      class="mt-4"
    >
      <slot />
    </div>
  </UCard>
</template>
