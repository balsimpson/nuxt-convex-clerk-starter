<script setup lang="ts">
defineProps<{
  name: string
  designation: string
  category: string
  imageUrl: string
}>()
</script>

<template>
  <article class="group flex h-full flex-col items-center rounded-[30px] border border-[#d6c3ae] bg-[#fffaf3] p-5 text-center shadow-[0_18px_42px_rgba(47,33,24,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(47,33,24,0.12)] sm:p-6">
    <div class="relative h-24 w-24 rounded-full border border-[#d6c3ae] bg-[#f3e8da] p-1 ring-4 ring-[#f8f1e7]">
      <img
        :src="imageUrl"
        :alt="name"
        loading="lazy"
        class="h-full w-full rounded-full object-cover object-center"
      >
    </div>

    <div class="mt-4 inline-flex rounded-full border border-[#d6c3ae] bg-[#fff7ed] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7b5a3d]">
      {{ category }}
    </div>

    <h3 class="mt-3 truncate text-lg font-semibold tracking-[-0.03em] text-[#2f2118] sm:text-xl">
      {{ name }}
    </h3>

    <p class="mt-1 text-sm leading-6 text-[#6e5b4b] sm:text-base">
      {{ designation }}
    </p>
  </article>
</template>
