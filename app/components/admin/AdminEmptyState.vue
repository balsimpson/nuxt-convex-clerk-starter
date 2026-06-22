<script setup lang="ts">
defineEmits<{
  action: []
}>()

defineProps<{
  title: string
  description: string
  icon?: string
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <UCard>
    <div class="space-y-6 text-center">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UIcon
          :name="icon || 'i-lucide-folder'"
          class="h-6 w-6"
        />
      </div>

      <div class="space-y-2">
        <h1 class="text-xl font-semibold text-highlighted">
          {{ title }}
        </h1>

        <p class="text-sm leading-6 text-muted">
          {{ description }}
        </p>
      </div>

      <div v-if="actionLabel || actionTo">
        <UButton
          v-if="actionTo"
          :to="actionTo"
          color="primary"
          variant="outline"
          :label="actionLabel"
        />

        <UButton
          v-else
          color="primary"
          variant="outline"
          :label="actionLabel"
          @click="$emit('action')"
        />
      </div>
    </div>
  </UCard>
</template>
