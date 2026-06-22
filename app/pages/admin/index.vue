<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { useConvexClient } from 'convex-vue'
import type { ComponentPublicInstance } from 'vue'

definePageMeta({
  layout: 'admin'
})

type BlogStatus = 'draft' | 'published'

type BlogPost = {
  _id: Id<'posts'>
  title: string
  description: string
  image: string
  slug: string
  status: BlogStatus
  tags: string[]
  published_at: unknown
  updated_at: unknown
  author: {
    name: string
    email: string
    photo: string
    uid: string
  }
}

type BlogSectionState = {
  status: BlogStatus
  label: string
  eyebrow: string
  description: string
  badgeLabel: string
  badgeColor: 'success' | 'warning'
  count: number
  posts: BlogPost[]
  cursor: string | null
  isDone: boolean
  isLoadingInitial: boolean
  isLoadingMore: boolean
  errorMessage: string
  sentinel: HTMLElement | null
  sentinelVisible: boolean
  requestGeneration: number
}

const convex = useConvexClient()
const toast = useToast()
const searchQuery = ref('')
const activeSearchQuery = ref('')
const deleteModalOpen = ref(false)
const postPendingDelete = ref<BlogPost | null>(null)
const deleteErrorMessage = ref('')
const deletingId = ref<Id<'posts'> | null>(null)
const batchSize = 8
const activeStatus = ref<BlogStatus>('published')

let searchDebounce: ReturnType<typeof setTimeout> | null = null
const sectionObservers: Record<BlogStatus, IntersectionObserver | null> = {
  published: null,
  draft: null
}

function createSection(
  status: BlogStatus,
  label: string,
  eyebrow: string,
  description: string,
  badgeLabel: string,
  badgeColor: 'success' | 'warning'
) {
  return reactive({
    status,
    label,
    eyebrow,
    description,
    badgeLabel,
    badgeColor,
    count: 0,
    posts: [],
    cursor: null,
    isDone: false,
    isLoadingInitial: true,
    isLoadingMore: false,
    errorMessage: '',
    sentinel: null,
    sentinelVisible: false,
    requestGeneration: 0
  }) as BlogSectionState
}

const publishedSection = createSection(
  'published',
  'Published',
  'Live archive',
  'A published list of posts.',
  '',
  'success'
)

const draftSection = createSection(
  'draft',
  'Drafts',
  'Editor workspace',
  'Review unpublished posts before publishing.',
  '',
  'warning'
)

const sections = [publishedSection, draftSection] as const
let countsRequestGeneration = 0

function formatDate(value: unknown, fallback: string) {
  if (!value) return fallback

  const date = value instanceof Date ? value : new Date(value as string | number)

  if (Number.isNaN(date.getTime())) return fallback

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatPublishedAt(value: unknown) {
  return formatDate(value, 'Latest post')
}

function formatUpdatedAt(value: unknown) {
  return formatDate(value, 'Latest update')
}

function sectionItemLabel(status: BlogStatus) {
  return status === 'published' ? 'published posts' : 'drafts'
}

function sectionDateLabel(status: BlogStatus) {
  return status === 'published' ? 'Published' : 'Updated'
}

function sectionDateValue(section: BlogSectionState, post: BlogPost) {
  return section.status === 'published'
    ? formatPublishedAt(post.published_at)
    : formatUpdatedAt(post.updated_at)
}

function sectionLoadingMessage(section: BlogSectionState) {
  return section.isLoadingInitial
    ? `Loading ${sectionItemLabel(section.status)}...`
    : `Loading more ${sectionItemLabel(section.status)}...`
}

function sectionEmptyMessage(section: BlogSectionState) {
  return activeSearchQuery.value
    ? `No ${sectionItemLabel(section.status)} match your search.`
    : `No ${sectionItemLabel(section.status)} found.`
}

function sectionEndMessage(section: BlogSectionState) {
  return section.status === 'published'
    ? 'You have reached the end of the published archive.'
    : 'You have reached the end of the drafts list.'
}

function isActiveSection(section: BlogSectionState) {
  return activeStatus.value === section.status
}

function isSectionNearViewport(section: BlogSectionState) {
  if (!section.sentinel || typeof window === 'undefined') {
    return false
  }

  const rect = section.sentinel.getBoundingClientRect()
  return rect.top <= window.innerHeight + 800
}

function maybeLoadMore(section: BlogSectionState) {
  if (!isActiveSection(section) || section.isDone || section.isLoadingMore || !isSectionNearViewport(section)) {
    return
  }

  void loadMorePosts(section)
}

function handleScroll() {
  for (const section of sections) {
    maybeLoadMore(section)
  }
}

function postEditorUrl(id: string) {
  return `/admin/blog/${id}`
}

function setSectionSentinel(section: BlogSectionState, element: Element | ComponentPublicInstance | null) {
  section.sentinel = element instanceof HTMLElement ? element : null
}

function openDeleteModal(post: BlogPost) {
  postPendingDelete.value = post
  deleteErrorMessage.value = ''
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  if (deletingId.value) {
    return
  }

  deleteModalOpen.value = false
  postPendingDelete.value = null
  deleteErrorMessage.value = ''
}

async function confirmDeletePost() {
  const post = postPendingDelete.value

  if (!post || deletingId.value) {
    return
  }

  deletingId.value = post._id
  deleteErrorMessage.value = ''
  countsRequestGeneration += 1

  try {
    await convex.mutation(api.posts.remove, { id: post._id })

    for (const section of sections) {
      section.posts = section.posts.filter(item => item._id !== post._id)

      if (section.status === post.status) {
        section.count = Math.max(0, section.count - 1)
      }
    }

    deleteModalOpen.value = false
    postPendingDelete.value = null

    toast.add({
      title: 'Blog post deleted',
      color: 'success'
    })
  } catch (error) {
    deleteErrorMessage.value = error instanceof Error ? error.message : 'Failed to delete blog post.'
  } finally {
    deletingId.value = null
    void loadSectionCounts()
  }
}

async function loadSectionCounts() {
  const generation = countsRequestGeneration

  try {
    const response = await convex.query(api.posts.statusCounts, {}) as {
      published: number
      draft: number
    }

    if (generation === countsRequestGeneration) {
      publishedSection.count = response.published
      draftSection.count = response.draft
    }
  } catch {
    // Keep the fallback loaded-item counts if the count query fails.
  }
}

async function loadMorePosts(section: BlogSectionState) {
  if (section.isDone || section.isLoadingMore) {
    return
  }

  const generation = section.requestGeneration
  section.isLoadingMore = true
  section.errorMessage = ''
  let failed = false

  try {
    const response = await convex.query(api.posts.listForAdminByStatus, {
      paginationOpts: {
        numItems: batchSize,
        cursor: section.cursor
      },
      searchQuery: activeSearchQuery.value || undefined,
      status: section.status
    }) as {
      page: BlogPost[]
      isDone: boolean
      continueCursor: string
    }

    if (generation === section.requestGeneration) {
      section.posts.push(...response.page)
      section.cursor = response.isDone ? null : response.continueCursor
      section.isDone = response.isDone
    }
  } catch (error) {
    failed = true

    if (generation === section.requestGeneration) {
      section.errorMessage = error instanceof Error
        ? error.message
        : `Failed to load ${sectionItemLabel(section.status)}.`
    }
  } finally {
    if (generation === section.requestGeneration) {
      section.isLoadingMore = false
      section.isLoadingInitial = false

      await nextTick()

      if (!failed && !section.isDone && !section.isLoadingMore) {
        handleScroll()
      }
    }
  }
}

function resetSectionForSearch(section: BlogSectionState) {
  section.requestGeneration += 1
  section.posts = []
  section.cursor = null
  section.isDone = false
  section.isLoadingInitial = true
  section.isLoadingMore = false
  section.errorMessage = ''
  section.sentinelVisible = false

  void loadMorePosts(section)
}

function resetSectionsForSearch(query: string) {
  activeSearchQuery.value = query

  for (const section of sections) {
    resetSectionForSearch(section)
  }
}

function setupObserver(section: BlogSectionState) {
  if (!section.sentinel || typeof IntersectionObserver === 'undefined') {
    sectionObservers[section.status]?.disconnect()
    sectionObservers[section.status] = null
    return
  }

  sectionObservers[section.status]?.disconnect()

  sectionObservers[section.status] = new IntersectionObserver((entries) => {
    const entry = entries[0]

    if (!entry) {
      return
    }

    section.sentinelVisible = entry.isIntersecting

    if (entry.isIntersecting) {
      void loadMorePosts(section)
    }
  }, {
    root: null,
    rootMargin: '800px 0px 800px 0px',
    threshold: 0
  })

  sectionObservers[section.status]?.observe(section.sentinel)
}

function setupObservers() {
  for (const section of sections) {
    setupObserver(section)
  }
}

onMounted(async () => {
  await Promise.all([
    Promise.all(sections.map(section => loadMorePosts(section))),
    loadSectionCounts()
  ])
  await nextTick()
  setupObservers()
  handleScroll()

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
})

onBeforeUnmount(() => {
  for (const status of Object.keys(sectionObservers) as BlogStatus[]) {
    sectionObservers[status]?.disconnect()
    sectionObservers[status] = null
  }

  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)

  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
})

watch(activeStatus, async () => {
  await nextTick()
  handleScroll()
})

watch(searchQuery, (value) => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  searchDebounce = setTimeout(() => {
    const query = value.trim()

    if (query !== activeSearchQuery.value) {
      resetSectionsForSearch(query)
    }
  }, 300)
})

watch(deleteModalOpen, (isOpen) => {
  if (!isOpen && !deletingId.value) {
    postPendingDelete.value = null
    deleteErrorMessage.value = ''
  }
})
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <UPageHeader
        headline="Admin"
        title="Blog posts"
        :links="[
          {
            label: 'Add blog post',
            to: '/admin/blog/new',
            color: 'primary',
            icon: 'i-lucide-plus'
          },
          {
            label: 'Open blog',
            to: '/blog',
            color: 'primary',
            variant: 'outline',
            icon: 'i-lucide-arrow-up-right'
          }
        ]"
      />

      <div class="py-8">
        <section class="border-b border-default">
          <div class="sticky top-0 z-20 border-b border-default bg-[#fbf7ef]/95 backdrop-blur-xl">
            <div class="py-4">
              <div
                role="tablist"
                aria-label="Blog post status"
                class="flex flex-wrap gap-2"
              >
                <button
                  v-for="section in sections"
                  :id="`tab-${section.status}`"
                  :key="section.status"
                  type="button"
                  role="tab"
                  :aria-selected="activeStatus === section.status"
                  :aria-controls="`panel-${section.status}`"
                  :tabindex="activeStatus === section.status ? 0 : -1"
                  class="inline-flex items-center gap-2 border-b-2 px-1 pb-2 text-sm font-medium transition-colors"
                  :class="activeStatus === section.status
                    ? 'border-[#5f3724] text-[#2f2118]'
                    : 'border-transparent text-[#6f6255] hover:text-[#2f2118]'"
                  @click="activeStatus = section.status"
                >
                  <span class="inline-flex items-center gap-2 whitespace-nowrap">
                    <span>{{ section.label }}</span>

                    <span class="inline-flex min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium tabular-nums leading-none text-primary">
                      {{ section.count || section.posts.length }}
                    </span>
                  </span>

                  <span class="text-xs uppercase tracking-[0.2em] text-muted">
                    {{ section.badgeLabel }}
                  </span>
                </button>
              </div>
            </div>

            <div class="border-t border-default py-4">
              <UInput
                v-model="searchQuery"
                icon="i-lucide-search"
                placeholder="Search blog titles"
                aria-label="Search blog titles"
                autocomplete="off"
                class="w-full sm:max-w-sm"
                :ui="{ trailing: 'pe-1' }"
              >
                <template
                  v-if="searchQuery"
                  #trailing
                >
                  <UButton
                    type="button"
                    color="primary"
                    variant="link"
                    size="sm"
                    icon="i-lucide-x"
                    aria-label="Clear blog search"
                    @click="searchQuery = ''"
                  />
                </template>
              </UInput>
            </div>
          </div>

          <div class="border-t border-default py-6">
            <section
              v-for="section in sections"
              v-show="isActiveSection(section)"
              :id="`panel-${section.status}`"
              :key="section.status"
              role="tabpanel"
              :aria-labelledby="`tab-${section.status}`"
              class="space-y-4"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-xs uppercase tracking-[0.28em] text-muted">
                      {{ section.eyebrow }}
                    </p>

                    <UBadge
                      :color="section.badgeColor"
                      variant="soft"
                      size="sm"
                    >
                      {{ section.badgeLabel }}
                    </UBadge>
                  </div>

                  <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                    {{ section.label }}
                  </h2>

                  <p class="max-w-2xl text-sm leading-6 text-muted">
                    {{ section.description }}
                  </p>
                </div>
              </div>

              <UAlert
                v-if="section.errorMessage"
                color="error"
                variant="soft"
                :title="section.errorMessage"
              />

              <div
                v-if="section.posts.length"
                class="divide-y divide-default border-y border-default"
              >
                <div
                  v-for="post in section.posts"
                  :key="post._id"
                  class="group flex items-start gap-3 py-5 transition-colors hover:bg-elevated/35 sm:gap-5"
                >
                  <NuxtLink
                    :to="postEditorUrl(post._id)"
                    class="flex min-w-0 flex-1 gap-4 sm:gap-5"
                  >
                    <div
                      v-if="post.image"
                      class="h-20 w-24 shrink-0 overflow-hidden bg-elevated sm:h-24 sm:w-36"
                    >
                      <img
                        :src="post.image"
                        :alt="post.title"
                        class="h-full w-full object-cover"
                      >
                    </div>

                    <div
                      v-else
                      class="flex h-20 w-24 shrink-0 items-center justify-center bg-elevated text-muted sm:h-24 sm:w-36"
                      aria-hidden="true"
                    >
                      <UIcon
                        name="i-lucide-image-off"
                        class="h-5 w-5 sm:h-6 sm:w-6"
                      />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
                        <span>{{ sectionDateLabel(section.status) }}</span>
                        <span>{{ sectionDateValue(section, post) }}</span>
                        <span v-if="post.author.name">{{ post.author.name }}</span>
                      </div>

                      <h3 class="mt-1 line-clamp-2 text-base font-semibold tracking-[-0.01em] text-highlighted group-hover:text-primary sm:text-lg">
                        {{ post.title }}</h3>

                      <p class="mt-1 line-clamp-2 text-sm leading-6 text-muted">
                        {{ post.description }}
                      </p>

                      <div
                        v-if="post.tags.length"
                        class="mt-3 flex flex-wrap gap-2"
                      >
                        <UBadge
                          v-for="tag in post.tags.slice(0, 3)"
                          :key="tag"
                          color="primary"
                          variant="soft"
                          size="sm"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                  </NuxtLink>

                  <div class="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0.5">
                    <UButton
                      :to="postEditorUrl(post._id)"
                      :aria-label="`Edit ${post.title}`"
                      icon="i-lucide-pencil"
                      color="primary"
                      variant="ghost"
                      size="sm"
                      class="shrink-0"
                    />

                    <UButton
                      :aria-label="`Delete ${post.title}`"
                      icon="i-lucide-trash-2"
                      color="error"
                      variant="ghost"
                      size="sm"
                      :loading="deletingId === post._id"
                      class="shrink-0"
                      @click="openDeleteModal(post)"
                    />
                  </div>
                </div>
              </div>

              <div
                v-else-if="!section.isLoadingInitial && !section.errorMessage"
                class="flex min-h-24 items-center justify-center border-y border-default px-4 text-sm text-muted"
              >
                {{ sectionEmptyMessage(section) }}
              </div>

              <div class="flex min-h-20 items-center justify-center px-4 text-sm text-muted">
                <span v-if="section.isLoadingInitial || section.isLoadingMore">
                  {{ sectionLoadingMessage(section) }}
                </span>

                <span v-else-if="section.isDone && section.posts.length">
                  {{ sectionEndMessage(section) }}
                </span>

                <span v-else-if="section.posts.length">
                  Scroll down to load more.
                </span>
              </div>

              <div
                :ref="el => setSectionSentinel(section, el)"
                class="h-1 w-full"
              />
            </section>
          </div>
        </section>
      </div>
    </div>

    <UModal
      v-model:open="deleteModalOpen"
      :dismissible="!deletingId"
    >
      <template #header>
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
            <UIcon
              name="i-lucide-trash-2"
              class="h-5 w-5"
            />
          </div>

          <div class="min-w-0">
            <h2 class="text-base font-semibold text-highlighted">
              Delete blog post?
            </h2>
            <p class="mt-1 text-sm leading-6 text-muted">
              This will permanently delete "{{ postPendingDelete?.title }}".
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <UAlert
          v-if="deleteErrorMessage"
          color="error"
          variant="soft"
          :title="deleteErrorMessage"
        />

        <p
          v-else
          class="text-sm leading-6 text-muted"
        >
          Deleted posts are removed from this admin archive and cannot be restored from this page.
        </p>
      </template>

      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            type="button"
            color="primary"
            variant="outline"
            :disabled="!!deletingId"
            @click="closeDeleteModal"
          >
            Cancel
          </UButton>

          <UButton
            type="button"
            color="error"
            icon="i-lucide-trash-2"
            :loading="!!deletingId"
            @click="confirmDeletePost"
          >
            Delete post
          </UButton>
        </div>
      </template>
    </UModal>
  </UPage>
</template>
