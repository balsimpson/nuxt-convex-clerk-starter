<template>
  <div class="min-h-screen bg-[#f7efe2] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 pb-[4.5rem] pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
      <div class="mx-auto max-w-7xl">
        <UBreadcrumb
          :items="breadcrumbItems"
          separator-icon="i-lucide-chevron-right"
          class="mb-8 text-[#665646]"
        />

        <UAlert
          v-if="errorMessage && !post"
          color="error"
          variant="soft"
          title="Post unavailable"
          :description="errorMessage"
          class="mt-8"
        />

        <div
          v-else-if="isLoading && !post"
          class="flex min-h-[40vh] items-center justify-center border-b border-[#d9c9b7] px-6 py-20 text-sm text-[#665646]"
        >
          Loading post...
        </div>

        <template v-else-if="post">
          <section class="border-b border-[#d9c9b7] pb-10 lg:pb-12">
            <div class="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-end lg:gap-16">
              <div class="max-w-4xl">
                <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                  Blog archive
                </p>

                <h1 class="mt-5 font-serif text-5xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-6xl lg:text-7xl">
                  {{ post.title }}
                </h1>

                <p class="mt-6 text-xs font-semibold uppercase text-[#7a4f36]">
                  {{ formatPublishedAt(post.published_at) }}
                </p>
              </div>

              <img
                :src="post.image"
                :alt="post.title"
                class="aspect-[4/3] w-full object-cover object-center lg:aspect-[16/10]"
              >
            </div>
          </section>

          <article>
            <section class="border-b border-[#d9c9b7] py-10 lg:py-14">
              <div class="max-w-3xl space-y-7 text-[1.02rem] leading-8 text-[#4f4236] sm:text-[1.08rem]">
                <p
                  v-if="!contentBlocks.length"
                  class="text-lg leading-8 text-[#4f4236]"
                >
                  {{ post.description }}
                </p>

                <template
                  v-for="(block, index) in contentBlocks"
                  :key="index"
                >
                  <h2
                    v-if="block.kind === 'heading'"
                    class="font-serif text-3xl font-normal leading-tight text-[#2f2118] text-balance sm:text-4xl"
                    :class="headingClass(block.level)"
                  >
                    {{ block.text }}
                  </h2>

                  <p
                    v-else-if="block.kind === 'paragraph'"
                    class="whitespace-pre-line"
                  >
                    {{ block.text }}
                  </p>

                  <blockquote
                    v-else-if="block.kind === 'quote'"
                    class="border-l-2 border-[#8a6a52] pl-5 font-serif text-2xl leading-9 text-[#665646]"
                  >
                    {{ block.text }}
                  </blockquote>

                  <ul
                    v-else-if="block.kind === 'list'"
                    class="space-y-3 pl-5"
                  >
                    <li
                      v-for="item in block.items"
                      :key="item"
                      class="list-disc"
                    >
                      {{ item }}
                    </li>
                  </ul>

                  <figure
                    v-else-if="block.kind === 'image'"
                    class="space-y-3"
                  >
                    <img
                      :src="block.src"
                      :alt="block.alt"
                      class="w-full object-cover"
                    >
                    <figcaption class="text-sm text-[#665646]">
                      {{ block.alt }}
                    </figcaption>
                  </figure>

                  <pre
                    v-else-if="block.kind === 'code'"
                    class="overflow-x-auto border border-[#d0bda8] bg-[#efe2d0] p-5 text-sm leading-7 text-[#3a2718]"
                  >{{ block.text }}</pre>
                </template>
              </div>
            </section>

            <section class="border-b border-[#d9c9b7] py-10 lg:py-12">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                    Suggested posts
                  </p>
                  <h2 class="mt-2 font-serif text-4xl font-normal leading-tight text-[#2f2118] text-balance sm:text-5xl">
                    Continue reading
                  </h2>
                </div>

                <UButton
                  to="/blog"
                  color="neutral"
                  variant="outline"
                  trailing-icon="i-lucide-arrow-right"
                  class="rounded-none border-[#8a6a52] px-5 py-3 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
                >
                  View all posts
                </UButton>
              </div>

              <div
                v-if="relatedPosts.length"
                class="mt-8 grid auto-rows-fr grid-cols-1 border-b border-[#d9c9b7] sm:grid-cols-2"
              >
                <NuxtLink
                  v-for="(related, index) in relatedPosts"
                  :key="related._id"
                  :to="postUrl(related.slug)"
                  class="group flex h-full flex-col border-t border-[#d9c9b7] py-6 transition hover:bg-[#efe2d0]/55 sm:px-5 sm:[&:nth-child(-n+2)]:border-t-0"
                  :class="index % 2 === 0 ? 'sm:border-r sm:border-[#d9c9b7]' : ''"
                >
                  <img
                    :src="related.image"
                    :alt="related.title"
                    class="aspect-[4/3] w-full object-cover object-center transition duration-700 group-hover:scale-[1.01]"
                  >

                  <p class="mt-5 text-xs font-semibold uppercase text-[#7a4f36]">
                    {{ formatPublishedAt(related.published_at) }}
                  </p>

                  <h3 class="mt-2 line-clamp-2 max-w-sm font-serif text-3xl leading-tight text-[#2f2118] text-balance">
                    {{ related.title }}
                  </h3>

                  <p class="mt-3 line-clamp-3 text-sm leading-7 text-[#665646] sm:text-base">
                    {{ related.description }}
                  </p>
                </NuxtLink>
              </div>

              <p
                v-else
                class="mt-8 text-sm text-[#665646]"
              >
                No additional posts available.
              </p>
            </section>
          </article>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { api } from '../../../convex/_generated/api'
import { useConvexClient } from 'convex-vue'

type BlogPost = {
  _id: string
  title: string
  description: string
  image: string
  slug: string
  tags: string[]
  published_at: unknown
  content: unknown
  author: {
    name: string
    email: string
    photo: string
    uid: string
  }
}

type ContentBlock
  = { kind: 'heading', text: string, level: number }
    | { kind: 'paragraph', text: string }
    | { kind: 'quote', text: string }
    | { kind: 'list', items: string[] }
    | { kind: 'image', src: string, alt: string }
    | { kind: 'code', text: string }

const route = useRoute()
const convex = useConvexClient()

const post = ref<BlogPost | null>(null)
const relatedPosts = ref<BlogPost[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const contentBlocks = computed(() => normalizeContent(post.value?.content))
const breadcrumbItems = computed(() => [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Blog archive',
    to: '/blog'
  },
  ...(post.value?.title ? [{ label: post.value.title }] : [])
] satisfies BreadcrumbItem[])

let requestId = 0

const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value[0] ?? '' : String(value ?? '')
})

watch(slug, () => {
  void loadPost()
}, { immediate: true })

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

function postUrl(value: string) {
  return `/blog/${value}`
}

function headingClass(level: number) {
  if (level <= 2) return 'mt-10'
  if (level === 3) return 'mt-8 text-2xl sm:text-[2rem]'
  return 'mt-6 text-xl sm:text-2xl'
}

function normalizeContent(content: unknown): ContentBlock[] {
  const blocks: ContentBlock[] = []

  const addText = (value: string) => {
    const text = value.replace(/\r\n/g, '\n').trim()

    if (!text) {
      return
    }

    const lines = text.split('\n').map(line => line.trim()).filter(Boolean)

    if (lines.length > 1 && lines.every(line => /^(-|\*|•)\s+/.test(line))) {
      blocks.push({
        kind: 'list',
        items: lines.map(line => line.replace(/^(-|\*|•)\s+/, ''))
      })

      return
    }

    for (const paragraph of text.split(/\n\s*\n/)) {
      const trimmed = paragraph.trim()

      if (!trimmed) {
        continue
      }

      if (/^#{1,4}\s+/.test(trimmed)) {
        const headingLevel = Math.min(trimmed.match(/^#{1,4}/)?.[0].length ?? 2, 4)
        blocks.push({
          kind: 'heading',
          level: headingLevel,
          text: trimmed.replace(/^#{1,4}\s+/, '')
        })

        continue
      }

      if (/^>\s+/.test(trimmed)) {
        blocks.push({
          kind: 'quote',
          text: trimmed.replace(/^>\s+/, '')
        })

        continue
      }

      blocks.push({
        kind: 'paragraph',
        text: trimmed
      })
    }
  }

  const pushItem = (item: unknown) => {
    if (item == null) {
      return
    }

    if (typeof item === 'string') {
      addText(item)
      return
    }

    if (typeof item === 'number' || typeof item === 'boolean') {
      addText(String(item))
      return
    }

    if (Array.isArray(item)) {
      item.forEach(pushItem)
      return
    }

    if (typeof item !== 'object') {
      return
    }

    const record = item as Record<string, unknown>
    const type = String(record.type ?? record.kind ?? '').toLowerCase()

    if (type === 'doc') {
      pushItem(record.content)
      return
    }

    if (type === 'paragraph') {
      const text = toText(record.text ?? record.content ?? record.children)
      if (text) {
        blocks.push({ kind: 'paragraph', text })
      }

      return
    }

    if (type === 'heading') {
      const attrs = isRecord(record.attrs) ? record.attrs : {}
      const text = toText(record.text ?? record.content ?? record.children)
      if (text) {
        blocks.push({
          kind: 'heading',
          level: Number(attrs.level ?? record.level ?? record.depth ?? 2),
          text
        })
      }

      return
    }

    if (type === 'blockquote') {
      const text = toText(record.text ?? record.content ?? record.children)
      if (text) {
        blocks.push({ kind: 'quote', text })
      }

      return
    }

    if (type === 'bulletlist' || type === 'orderedlist') {
      const items = Array.isArray(record.content)
        ? record.content.map(toText).filter(Boolean)
        : []

      if (items.length) {
        blocks.push({ kind: 'list', items })
      }

      return
    }

    if (type === 'listitem') {
      const text = toText(record.text ?? record.content ?? record.children)
      if (text) {
        blocks.push({ kind: 'paragraph', text })
      }

      return
    }

    if (type === 'codeblock') {
      const text = toText(record.code ?? record.text ?? record.value ?? record.content ?? record.children)
      if (text) {
        blocks.push({ kind: 'code', text })
      }

      return
    }

    if (Array.isArray(record.blocks)) {
      pushItem(record.blocks)
      return
    }

    if (Array.isArray(record.content)) {
      pushItem(record.content)
      return
    }

    if (Array.isArray(record.children)) {
      pushItem(record.children)
      return
    }

    if (type === 'image') {
      const attrs = isRecord(record.attrs) ? record.attrs : {}
      const src = String(attrs.src ?? record.src ?? record.url ?? record.image ?? '')
      if (src) {
        blocks.push({
          kind: 'image',
          src,
          alt: String(attrs.alt ?? record.alt ?? record.caption ?? record.title ?? 'Blog image')
        })
      }

      return
    }

    if (type === 'list') {
      const items = Array.isArray(record.items)
        ? record.items.map(toText).filter(Boolean)
        : []

      if (items.length) {
        blocks.push({ kind: 'list', items })
      }

      return
    }

    if (type === 'code') {
      const text = toText(record.code ?? record.text ?? record.value ?? record.children)
      if (text) {
        blocks.push({ kind: 'code', text })
      }

      return
    }

    if (type === 'quote') {
      const text = toText(record.text ?? record.value ?? record.children)
      if (text) {
        blocks.push({ kind: 'quote', text })
      }

      return
    }

    if (type === 'heading') {
      const text = toText(record.text ?? record.value ?? record.children)
      if (text) {
        blocks.push({
          kind: 'heading',
          level: Number(record.level ?? record.depth ?? 2),
          text
        })
      }

      return
    }

    const text = toText(record.text ?? record.content ?? record.body ?? record.value ?? record.children)
    if (text) {
      addText(text)
    }
  }

  const toText = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) return value.map(toText).filter(Boolean).join('\n')

    if (isRecord(value)) {
      const record = value as Record<string, unknown>
      return toText(record.text ?? record.content ?? record.body ?? record.value ?? record.children ?? record.items ?? '')
    }

    return ''
  }

  pushItem(content)

  return blocks
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function pickRelatedPosts(posts: BlogPost[], currentSlug: string) {
  return posts
    .filter(postItem => postItem.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
}

async function loadPost() {
  const currentSlug = slug.value

  if (!currentSlug) {
    post.value = null
    relatedPosts.value = []
    errorMessage.value = 'Missing blog slug.'
    isLoading.value = false
    return
  }

  const currentRequest = ++requestId
  isLoading.value = true
  errorMessage.value = ''
  post.value = null
  relatedPosts.value = []

  try {
    const [postResult, latestResult] = await Promise.all([
      convex.query(api.posts.getBySlug, { slug: currentSlug }) as Promise<BlogPost | null>,
      convex.query(api.posts.latest, { limit: 12 }) as unknown as Promise<BlogPost[]>
    ])

    if (currentRequest !== requestId) {
      return
    }

    if (!postResult) {
      errorMessage.value = 'This post could not be found.'
      return
    }

    post.value = postResult
    relatedPosts.value = pickRelatedPosts(latestResult, currentSlug)
  } catch (error) {
    if (currentRequest !== requestId) {
      return
    }

    errorMessage.value = error instanceof Error ? error.message : 'Failed to load this post.'
  } finally {
    if (currentRequest === requestId) {
      isLoading.value = false
    }
  }
}
</script>
