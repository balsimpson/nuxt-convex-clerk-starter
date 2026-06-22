<template>
  <div class="min-h-screen bg-[#fbf7ef] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 pb-[4.5rem] pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
      <div class="mx-auto max-w-7xl">
        <UBreadcrumb
          :items="breadcrumbItems"
          separator-icon="i-lucide-chevron-right"
          class="mb-8 text-[#4f4134]"
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
          class="flex min-h-[40vh] items-center justify-center border-b border-[#d9c9b7] px-6 py-20 text-sm text-[#4f4134]"
        >
          Loading post...
        </div>

        <template v-else-if="post">
          <section class="border-b border-[#d9c9b7] pb-10 lg:pb-12">
            <div class="max-w-4xl">
              <p class="text-xs font-semibold uppercase text-[#5f3724]">
                Blog
              </p>

              <h1 class="mt-5 font-serif text-5xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-6xl lg:text-7xl">
                {{ post.title }}
              </h1>

              <p class="mt-6 text-xs font-semibold uppercase text-[#5f3724]">
                {{ formatPublishedAt(post.published_at) }}
              </p>
            </div>
          </section>

          <article>
            <section class="border-b border-[#d9c9b7] py-10 lg:py-14">
              <div class="max-w-3xl space-y-7 text-[1.02rem] leading-8 text-[#46382c] sm:text-[1.08rem]">
                <p
                  v-if="!contentBlocks.length"
                  class="text-lg leading-8 text-[#46382c]"
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
                    <InlineContent :nodes="block.nodes" />
                  </h2>

                  <p
                    v-else-if="block.kind === 'paragraph'"
                    class="whitespace-pre-line"
                  >
                    <InlineContent :nodes="block.nodes" />
                  </p>

                  <blockquote
                    v-else-if="block.kind === 'quote'"
                    class="border-l-2 border-[#8a6a52] pl-5 font-serif text-2xl leading-9 text-[#4f4134]"
                  >
                    <InlineContent :nodes="block.nodes" />
                  </blockquote>

                  <ul
                    v-else-if="block.kind === 'list'"
                    class="space-y-3 pl-5"
                  >
                    <li
                      v-for="(item, itemIndex) in block.items"
                      :key="itemIndex"
                      class="list-disc"
                    >
                      <InlineContent :nodes="item" />
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
                    <figcaption
                      v-if="block.alt"
                      class="text-sm text-[#4f4134]"
                    >
                      {{ block.alt }}
                    </figcaption>
                  </figure>

                  <div
                    v-else-if="block.kind === 'video'"
                    class="aspect-video w-full overflow-hidden bg-[#2f2118]"
                  >
                    <iframe
                      :src="block.src"
                      :title="block.title"
                      class="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                    />
                  </div>

                  <pre
                    v-else-if="block.kind === 'code'"
                    class="overflow-x-auto border border-[#d0bda8] bg-[#efe2d0] p-5 text-sm leading-7 text-[#3a2718]"
                  >{{ block.text }}</pre>
                </template>
              </div>
            </section>

            <section class="border-b border-[#d9c9b7] py-8 lg:py-10">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Suggested posts
                  </p>
                  <h2 class="mt-1 font-serif text-3xl font-normal leading-tight text-[#2f2118] text-balance sm:text-4xl">
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
                class="mt-6 grid auto-rows-fr grid-cols-1 border-b border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
              >
                <NuxtLink
                  v-for="(related, index) in relatedPosts"
                  :key="related._id"
                  :to="postUrl(related.slug)"
                  class="group grid h-full grid-cols-[7rem_1fr] gap-4 border-t border-[#d9c9b7] py-5 transition hover:bg-[#efe2d0]/55 sm:flex sm:flex-col sm:px-4 sm:[&:nth-child(-n+2)]:border-t-0 lg:[&:nth-child(-n+3)]:border-t-0"
                  :class="[
                    index % 2 === 0 ? 'sm:border-r sm:border-[#d9c9b7]' : '',
                    index % 3 !== 2 ? 'lg:border-r lg:border-[#d9c9b7]' : 'lg:border-r-0'
                  ]"
                >
                  <img
                    :src="related.image"
                    :alt="related.title"
                    class="aspect-square w-full object-cover object-center transition duration-700 group-hover:scale-[1.01] sm:aspect-[16/9]"
                  >

                  <div class="min-w-0">
                    <p class="text-[0.7rem] font-semibold uppercase text-[#5f3724] sm:mt-4">
                      {{ formatPublishedAt(related.published_at) }}
                    </p>

                    <h3 class="mt-2 line-clamp-2 max-w-sm font-serif text-xl leading-tight text-[#2f2118] text-balance sm:text-2xl">
                      {{ related.title }}
                    </h3>

                    <p class="mt-2 line-clamp-2 text-sm leading-6 text-[#4f4134]">
                      {{ related.description }}
                    </p>
                  </div>
                </NuxtLink>
              </div>

              <p
                v-else
                class="mt-8 text-sm text-[#4f4134]"
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
import { Fragment, defineComponent, h } from 'vue'
import type { PropType, VNodeChild } from 'vue'
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

type InlineNode
  = { kind: 'text', text: string }
    | { kind: 'strong', nodes: InlineNode[] }
    | { kind: 'em', nodes: InlineNode[] }
    | { kind: 'code', text: string }
    | { kind: 'link', href: string, nodes: InlineNode[] }
    | { kind: 'break' }

type ContentBlock
  = { kind: 'heading', nodes: InlineNode[], level: number }
    | { kind: 'paragraph', nodes: InlineNode[] }
    | { kind: 'quote', nodes: InlineNode[] }
    | { kind: 'list', items: InlineNode[][] }
    | { kind: 'image', src: string, alt: string }
    | { kind: 'video', src: string, title: string }
    | { kind: 'code', text: string }

const InlineContent = defineComponent({
  props: {
    nodes: {
      type: Array as PropType<InlineNode[]>,
      required: true
    }
  },
  setup(props) {
    const renderNode = (node: InlineNode, index: number): VNodeChild => {
      if (node.kind === 'text') return node.text
      if (node.kind === 'break') return h('br', { key: index })
      if (node.kind === 'code') return h('code', { key: index, class: 'rounded bg-[#efe2d0] px-1.5 py-0.5 font-mono text-[0.9em] text-[#3a2718]' }, node.text)
      if (node.kind === 'strong') return h('strong', { key: index, class: 'font-semibold text-[#2f2118]' }, node.nodes.map(renderNode))
      if (node.kind === 'em') return h('em', { key: index }, node.nodes.map(renderNode))
      if (node.kind === 'link') {
        return h(
          'a',
          {
            key: index,
            href: node.href,
            class: 'font-medium text-[#5f3724] underline decoration-[#8a6a52]/45 underline-offset-4 transition hover:text-[#2f2118]',
            rel: isExternalUrl(node.href) ? 'noopener noreferrer' : undefined,
            target: isExternalUrl(node.href) ? '_blank' : undefined
          },
          node.nodes.map(renderNode)
        )
      }

      return null
    }

    return () => h(Fragment, props.nodes.map(renderNode))
  }
})

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
    label: 'Blog',
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function isSafeUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return false
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return true
  if (/^(\/|#)/.test(trimmed)) return true

  return false
}

function sanitizeUrl(value: string) {
  const trimmed = value.trim()

  return isSafeUrl(trimmed) ? trimmed : ''
}

function parseMarkdownImage(value: string) {
  const match = value.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/)
  const src = match ? sanitizeUrl(match[2] ?? '') : ''

  return src
    ? {
        alt: match?.[1]?.trim() ?? '',
        src
      }
    : null
}

function getYouTubeEmbedUrl(value: string) {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    const id = host === 'youtu.be'
      ? url.pathname.split('/').filter(Boolean)[0]
      : ['youtube.com', 'm.youtube.com'].includes(host)
          ? url.searchParams.get('v') || url.pathname.match(/\/embed\/([^/?]+)/)?.[1] || ''
          : ''

    return id ? `https://www.youtube.com/embed/${id}` : ''
  } catch {
    return ''
  }
}

function parseInlineMarkdown(value: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let remaining = value

  const pushText = (text: string) => {
    if (text) nodes.push({ kind: 'text', text })
  }

  while (remaining) {
    const patterns = [
      { kind: 'code', match: remaining.match(/`([^`]+)`/) },
      { kind: 'link', match: remaining.match(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/) },
      { kind: 'strong', match: remaining.match(/(\*\*|__)(.+?)\1/) },
      { kind: 'em', match: remaining.match(/(\*|_)([^*_]+?)\1/) },
      { kind: 'break', match: remaining.match(/\n/) }
    ] as const

    const next = patterns
      .filter(item => item.match?.index != null)
      .sort((a, b) => (a.match?.index ?? 0) - (b.match?.index ?? 0))[0]

    if (!next?.match || next.match.index == null) {
      pushText(remaining)
      break
    }

    const index = next.match.index
    pushText(remaining.slice(0, index))

    if (next.kind === 'code') {
      nodes.push({ kind: 'code', text: next.match[1] ?? '' })
    } else if (next.kind === 'link') {
      const href = sanitizeUrl(next.match[2] ?? '')
      const label = next.match[1] ?? ''

      if (href) {
        nodes.push({ kind: 'link', href, nodes: parseInlineMarkdown(label) })
      } else {
        pushText(label)
      }
    } else if (next.kind === 'strong') {
      nodes.push({ kind: 'strong', nodes: parseInlineMarkdown(next.match[2] ?? '') })
    } else if (next.kind === 'em') {
      nodes.push({ kind: 'em', nodes: parseInlineMarkdown(next.match[2] ?? '') })
    } else {
      nodes.push({ kind: 'break' })
    }

    remaining = remaining.slice(index + next.match[0].length)
  }

  return nodes
}

function parseMarkdownBlocks(value: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  const lines = value.replace(/\r\n/g, '\n').split('\n')
  let index = 0

  const isBlockStart = (line: string) => (
    /^#{1,4}\s+/.test(line)
    || /^>\s?/.test(line)
    || /^(\s*)([-*+]|\d+\.)\s+/.test(line)
    || /^```/.test(line)
    || /^-{3,}$/.test(line.trim())
    || !!parseMarkdownImage(line)
  )

  while (index < lines.length) {
    const line = lines[index] ?? ''
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (/^```/.test(trimmed)) {
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !/^```/.test((lines[index] ?? '').trim())) {
        codeLines.push(lines[index] ?? '')
        index += 1
      }

      if (index < lines.length) index += 1
      blocks.push({ kind: 'code', text: codeLines.join('\n') })
      continue
    }

    const image = parseMarkdownImage(trimmed)
    if (image) {
      blocks.push({ kind: 'image', ...image })
      index += 1
      continue
    }

    const videoSrc = getYouTubeEmbedUrl(trimmed)
    if (videoSrc) {
      blocks.push({ kind: 'video', src: videoSrc, title: 'YouTube video' })
      index += 1
      continue
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (heading) {
      blocks.push({
        kind: 'heading',
        level: Math.min(heading[1]?.length ?? 2, 4),
        nodes: parseInlineMarkdown(heading[2] ?? '')
      })
      index += 1
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = []

      while (index < lines.length && /^>\s?/.test((lines[index] ?? '').trim())) {
        quoteLines.push((lines[index] ?? '').trim().replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push({ kind: 'quote', nodes: parseInlineMarkdown(quoteLines.join('\n')) })
      continue
    }

    if (/^(\s*)([-*+]|\d+\.)\s+/.test(line)) {
      const items: InlineNode[][] = []

      while (index < lines.length && /^(\s*)([-*+]|\d+\.)\s+/.test(lines[index] ?? '')) {
        items.push(parseInlineMarkdown((lines[index] ?? '').replace(/^(\s*)([-*+]|\d+\.)\s+/, '').trim()))
        index += 1
      }

      blocks.push({ kind: 'list', items })
      continue
    }

    if (/^-{3,}$/.test(trimmed)) {
      index += 1
      continue
    }

    const paragraphLines = [trimmed]
    index += 1

    while (index < lines.length && (lines[index] ?? '').trim() && !isBlockStart(lines[index] ?? '')) {
      paragraphLines.push((lines[index] ?? '').trim())
      index += 1
    }

    blocks.push({ kind: 'paragraph', nodes: parseInlineMarkdown(paragraphLines.join('\n')) })
  }

  return blocks
}

function toText(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join('\n')

  if (isRecord(value)) {
    const record = value as Record<string, unknown>
    return toText(record.text ?? record.content ?? record.body ?? record.value ?? record.children ?? record.items ?? '')
  }

  return ''
}

function normalizeContent(content: unknown): ContentBlock[] {
  const blocks: ContentBlock[] = []

  const pushMarkdown = (value: string) => {
    blocks.push(...parseMarkdownBlocks(value))
  }

  const pushItem = (item: unknown) => {
    if (item == null) return

    if (typeof item === 'string') {
      pushMarkdown(item)
      return
    }

    if (typeof item === 'number' || typeof item === 'boolean') {
      pushMarkdown(String(item))
      return
    }

    if (Array.isArray(item)) {
      item.forEach(pushItem)
      return
    }

    if (!isRecord(item)) return

    const type = String(item.type ?? item.kind ?? '').toLowerCase()
    const attrs = isRecord(item.attrs) ? item.attrs : {}

    if (type === 'doc') {
      pushItem(item.content)
      return
    }

    if (type === 'paragraph') {
      const text = toText(item.text ?? item.content ?? item.children)
      if (text) blocks.push({ kind: 'paragraph', nodes: parseInlineMarkdown(text) })
      return
    }

    if (type === 'heading') {
      const text = toText(item.text ?? item.content ?? item.children)
      if (text) {
        blocks.push({
          kind: 'heading',
          level: Number(attrs.level ?? item.level ?? item.depth ?? 2),
          nodes: parseInlineMarkdown(text)
        })
      }
      return
    }

    if (type === 'blockquote' || type === 'quote') {
      const text = toText(item.text ?? item.content ?? item.value ?? item.children)
      if (text) blocks.push({ kind: 'quote', nodes: parseInlineMarkdown(text) })
      return
    }

    if (type === 'bulletlist' || type === 'orderedlist' || type === 'list') {
      const sourceItems = Array.isArray(item.content) ? item.content : Array.isArray(item.items) ? item.items : []
      const items = sourceItems.map(value => parseInlineMarkdown(toText(value))).filter(value => value.length)
      if (items.length) blocks.push({ kind: 'list', items })
      return
    }

    if (type === 'listitem') {
      const text = toText(item.text ?? item.content ?? item.children)
      if (text) blocks.push({ kind: 'paragraph', nodes: parseInlineMarkdown(text) })
      return
    }

    if (type === 'image') {
      const src = sanitizeUrl(String(attrs.src ?? item.src ?? item.url ?? item.image ?? ''))
      if (src) {
        blocks.push({
          kind: 'image',
          src,
          alt: String(attrs.alt ?? item.alt ?? item.caption ?? item.title ?? '')
        })
      }
      return
    }

    if (type === 'youtube') {
      const src = getYouTubeEmbedUrl(String(attrs.src ?? item.src ?? ''))
      if (src) blocks.push({ kind: 'video', src, title: String(attrs.title ?? item.title ?? 'YouTube video') })
      return
    }

    if (type === 'codeblock' || type === 'code') {
      const text = toText(item.code ?? item.text ?? item.value ?? item.content ?? item.children)
      if (text) blocks.push({ kind: 'code', text })
      return
    }

    if (Array.isArray(item.blocks)) {
      pushItem(item.blocks)
      return
    }

    if (Array.isArray(item.content)) {
      pushItem(item.content)
      return
    }

    if (Array.isArray(item.children)) {
      pushItem(item.children)
      return
    }

    const text = toText(item.text ?? item.content ?? item.body ?? item.value ?? item.children)
    if (text) pushMarkdown(text)
  }

  pushItem(content)

  return blocks
}

function pickRelatedPosts(posts: BlogPost[], currentSlug: string) {
  return posts
    .filter(postItem => postItem.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
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
