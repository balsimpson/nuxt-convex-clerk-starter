<template>
  <section
    id="blog"
    class="relative overflow-hidden px-4 pb-24 pt-0 scroll-mt-28 sm:px-6 lg:px-8 lg:pb-32"
  >
    <div class="mx-auto max-w-7xl">
      <Motion
        as="p"
        class="mb-5 text-xs font-semibold uppercase text-[#5f3724]"
        :initial="revealInitial"
        :while-in-view="revealVisible"
        :in-view-options="viewOnce"
        :transition="revealTransition()"
      >
        Blog
      </Motion>

      <div class="grid gap-8 border-b border-[#d9c9b7] pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16 lg:pb-12">
        <div class="max-w-2xl">
          <Motion
            as="h2"
            class="font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl lg:text-6xl"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.08)"
          >
            Latest reflections from the field.
          </Motion>

          <Motion
            as="p"
            class="mt-6 text-base leading-8 text-[#4f4134] sm:text-lg"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.16)"
          >
            Community notes, program updates, and practical learning captured in short, direct writing.
          </Motion>

          <Motion
            as="div"
            class="mt-6"
            :initial="{ opacity: 0, y: 18 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.24)"
          >
            <UButton
              to="/blog"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-arrow-up-right"
              class="rounded-none border-[#8a6a52] px-5 py-3 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
            >
              Browse all posts
            </UButton>
          </Motion>
        </div>

        <Motion
          as="div"
          class="hidden text-sm leading-7 text-[#4f4134] sm:text-base lg:block lg:max-w-xl"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :in-view-options="viewOnce"
          :transition="revealTransition(0.16)"
        >
          The archive keeps the field work visible: what changed, what was learned, and where Manasa is focusing next.
        </Motion>
      </div>

      <div class="grid grid-cols-1 border-b border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3">
        <Motion
          v-for="(post, index) in posts"
          :key="post.slug"
          as="template"
          :initial="{ opacity: 0, y: 26 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :in-view-options="viewOnce"
          :transition="revealTransition(0.12 + index * 0.08)"
        >
          <NuxtLink
            :to="`/blog/${post.slug}`"
            class="group block border-t border-[#d9c9b7] py-6 transition first:border-t-0 hover:bg-[#efe2d0]/55 sm:px-5 sm:[&:nth-child(-n+2)]:border-t-0 lg:first:pl-0 lg:[&:nth-child(-n+3)]:border-t-0 lg:[&:not(:last-child)]:border-r lg:[&:not(:last-child)]:border-[#d9c9b7]"
          >
            <img
              :src="post.image"
              :alt="post.title"
              class="aspect-[4/3] w-full object-cover object-center transition duration-700 group-hover:scale-[1.01]"
            >

            <p class="mt-5 text-xs font-semibold uppercase text-[#5f3724]">
              {{ formatPublishedAt(post.published_at) }}
            </p>

            <h3 class="mt-2 max-w-sm font-serif text-3xl leading-tight text-[#2f2118] text-balance">
              {{ post.title }}
            </h3>
          </NuxtLink>
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { api } from '../../convex/_generated/api'
import { useConvexQuery } from 'convex-vue'

const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const revealInitial = { opacity: 0, y: 28 }
const revealVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.24, margin: '0px 0px -90px 0px' } as const

function revealTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}

const { data: postsData } = useConvexQuery(api.posts.latest, { limit: 3 })

const posts = computed(() => postsData.value ?? [])

function formatPublishedAt(value: unknown) {
  if (!value) return 'Latest post'

  const date = value instanceof Date ? value : new Date(value as string | number)

  if (Number.isNaN(date.getTime())) return 'Latest post'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}
</script>
