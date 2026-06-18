<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <UPageHeader
        headline="Admin"
        title="Add blog post"
        :links="[
          {
            label: 'Back to posts',
            to: '/admin',
            color: 'neutral',
            variant: 'outline',
            icon: 'i-lucide-arrow-left'
          }
        ]"
      />

      <div class="py-8">
        <AdminBlogPostEditor mode="create" />
      </div>
    </div>
  </UPage>
</template>
