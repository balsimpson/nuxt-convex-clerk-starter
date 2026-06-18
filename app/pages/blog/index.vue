<template>
  <div class="min-h-screen bg-[#f7efe2] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 pb-[4.5rem] pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
      <div class="mx-auto max-w-7xl">
        <section class="grid gap-8 border-b border-[#d9c9b7] pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16 lg:pb-12">
          <div class="max-w-3xl">
            <Motion
              as="p"
              class="mb-5 text-xs font-semibold uppercase text-[#7a4f36]"
              :initial="revealInitial"
              :animate="revealVisible"
              :transition="revealTransition(0.04)"
            >
              Blog archive
            </Motion>

            <Motion
              as="h1"
              class="font-serif text-5xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
              :initial="revealInitial"
              :animate="revealVisible"
              :transition="revealTransition(0.16)"
            >
              Stories, updates, and field notes.
            </Motion>

            <Motion
              as="p"
              class="mt-7 max-w-2xl text-base leading-8 text-[#665646] sm:text-lg"
              :initial="revealInitial"
              :animate="revealVisible"
              :transition="revealTransition(0.28)"
            >
              Community notes, program updates, and practical learning from Manasa's work across rights, education, livelihoods, and public action.
            </Motion>
          </div>

          <Motion
            as="div"
            class="flex lg:justify-end"
            :initial="{ opacity: 0, y: 18 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="revealTransition(0.34)"
          >
            <UButton
              to="/"
              color="neutral"
              variant="outline"
              icon="i-lucide-arrow-left"
              class="rounded-none border-[#8a6a52] px-5 py-3 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
            >
              Back home
            </UButton>
          </Motion>
        </section>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :title="errorMessage"
          class="mt-8"
        />

        <section class="grid auto-rows-fr grid-cols-1 border-b border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3">
          <Motion
            v-for="(post, index) in posts"
            :key="post._id"
            as="template"
            :initial="{ opacity: 0, y: 26 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.08 + (index % batchSize) * 0.045)"
          >
            <NuxtLink
              :to="postUrl(post.slug)"
              class="group flex h-full flex-col border-t border-[#d9c9b7] py-6 transition first:border-t-0 hover:bg-[#efe2d0]/55 sm:px-5 sm:[&:nth-child(-n+2)]:border-t-0 lg:[&:nth-child(-n+3)]:border-t-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:border-[#d9c9b7]"
            >
              <img
                :src="post.image"
                :alt="post.title"
                class="aspect-[4/3] w-full object-cover object-center transition duration-700 group-hover:scale-[1.01]"
              >

              <p class="mt-5 text-xs font-semibold uppercase text-[#7a4f36]">
                {{ formatPublishedAt(post.published_at) }}
              </p>

              <h2 class="mt-2 line-clamp-2 max-w-sm font-serif text-3xl leading-tight text-[#2f2118] text-balance">
                {{ post.title }}
              </h2>

              <p class="mt-3 line-clamp-3 text-sm leading-7 text-[#665646] sm:text-base">
                {{ post.description }}
              </p>

              <div
                v-if="post.tags.length"
                class="mt-auto flex flex-wrap gap-x-3 gap-y-2 border-t border-[#d9c9b7] pt-4"
              >
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag"
                  class="text-xs font-semibold uppercase text-[#7a4f36]"
                >
                  {{ tag }}
                </span>
              </div>
            </NuxtLink>
          </Motion>
        </section>

        <div class="flex min-h-24 items-center justify-center border-b border-[#d9c9b7] px-6 text-sm text-[#665646]">
          <span v-if="isLoadingInitial">
            Loading posts...
          </span>
          <span v-else-if="isLoadingMore">
            Loading more posts...
          </span>
          <span v-else-if="isDone">
            You have reached the end of the archive.
          </span>
          <span v-else-if="posts.length">
            Scroll down to load more.
          </span>
          <span v-else>
            No posts found.
          </span>
        </div>

        <div
          ref="sentinel"
          class="h-1 w-full"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import { useConvexClient } from 'convex-vue'

const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const revealInitial = { opacity: 0, y: 28 }
const revealVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.24, margin: '0px 0px -90px 0px' } as const

function revealTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}

type BlogPost = {
  _id: string
  title: string
  description: string
  image: string
  slug: string
  tags: string[]
  published_at: unknown
  author: {
    name: string
    email: string
    photo: string
    uid: string
  }
}

const convex = useConvexClient()
const posts = ref<BlogPost[]>([])
const cursor = ref<string | null>(null)
const isDone = ref(false)
const isLoadingInitial = ref(true)
const isLoadingMore = ref(false)
const errorMessage = ref('')
const sentinel = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
const batchSize = 6
const sentinelVisible = ref(false)

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

function postUrl(slug: string) {
  return `/blog/${slug}`
}

async function loadMorePosts() {
  if (isDone.value || isLoadingMore.value) {
    return
  }

  isLoadingMore.value = true
  errorMessage.value = ''
  let failed = false

  try {
    const response = await convex.query(api.posts.list, {
      paginationOpts: {
        numItems: batchSize,
        cursor: cursor.value
      }
    }) as {
      page: BlogPost[]
      isDone: boolean
      continueCursor: string
    }

    posts.value.push(...response.page)
    cursor.value = response.isDone ? null : response.continueCursor
    isDone.value = response.isDone
  } catch (error) {
    failed = true
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load posts.'
  } finally {
    isLoadingMore.value = false
    isLoadingInitial.value = false

    await nextTick()

    if (!failed && sentinelVisible.value && !isDone.value && !isLoadingMore.value) {
      void loadMorePosts()
    }
  }
}

function setupObserver() {
  if (!sentinel.value || typeof IntersectionObserver === 'undefined') {
    return
  }

  observer?.disconnect()

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]

    if (!entry) {
      return
    }

    sentinelVisible.value = entry.isIntersecting

    if (entry.isIntersecting) {
      void loadMorePosts()
    }
  }, {
    root: null,
    rootMargin: '800px 0px 800px 0px',
    threshold: 0
  })

  observer.observe(sentinel.value)
}

onMounted(async () => {
  await loadMorePosts()
  await nextTick()
  setupObserver()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
