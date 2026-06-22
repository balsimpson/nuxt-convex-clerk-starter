<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { useConvexClient } from 'convex-vue'

definePageMeta({
  layout: 'admin'
})

type BlogPost = {
  _id: Id<'posts'>
  title: string
  description: string
  image: string
  slug: string
  status: string
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
const toast = useToast()
const posts = ref<BlogPost[]>([])
const searchQuery = ref('')
const activeSearchQuery = ref('')
const cursor = ref<string | null>(null)
const isDone = ref(false)
const isLoadingInitial = ref(true)
const isLoadingMore = ref(false)
const errorMessage = ref('')
const deleteErrorMessage = ref('')
const deleteModalOpen = ref(false)
const postPendingDelete = ref<BlogPost | null>(null)
const deletingId = ref<Id<'posts'> | null>(null)
const sentinel = ref<HTMLElement | null>(null)
const sentinelVisible = ref(false)

let observer: IntersectionObserver | null = null
let searchDebounce: ReturnType<typeof setTimeout> | null = null
let requestGeneration = 0
const batchSize = 8

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

function postEditorUrl(id: string) {
  return `/admin/blog/${id}`
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

  try {
    await convex.mutation(api.posts.remove, { id: post._id })
    posts.value = posts.value.filter(item => item._id !== post._id)
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
  }
}

async function loadMorePosts() {
  if (isDone.value || isLoadingMore.value) {
    return
  }

  const generation = requestGeneration
  isLoadingMore.value = true
  errorMessage.value = ''
  let failed = false

  try {
    const response = await convex.query(api.posts.listForAdmin, {
      paginationOpts: {
        numItems: batchSize,
        cursor: cursor.value
      },
      searchQuery: activeSearchQuery.value || undefined
    }) as {
      page: BlogPost[]
      isDone: boolean
      continueCursor: string
    }

    if (generation === requestGeneration) {
      posts.value.push(...response.page)
      cursor.value = response.isDone ? null : response.continueCursor
      isDone.value = response.isDone
    }
  } catch (error) {
    failed = true
    if (generation === requestGeneration) {
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load blog posts.'
    }
  } finally {
    if (generation === requestGeneration) {
      isLoadingMore.value = false
      isLoadingInitial.value = false

      await nextTick()

      if (!failed && sentinelVisible.value && !isDone.value && !isLoadingMore.value) {
        void loadMorePosts()
      }
    }
  }
}

function resetPostsForSearch(query: string) {
  requestGeneration += 1
  activeSearchQuery.value = query
  posts.value = []
  cursor.value = null
  isDone.value = false
  isLoadingInitial.value = true
  isLoadingMore.value = false
  errorMessage.value = ''
  void loadMorePosts()
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

  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
})

watch(searchQuery, (value) => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  searchDebounce = setTimeout(() => {
    const query = value.trim()

    if (query !== activeSearchQuery.value) {
      resetPostsForSearch(query)
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
        title="Overview"
        :links="[
          {
            label: 'Add blog post',
            to: '/admin/blog/new',
            color: 'primary',
            icon: 'i-lucide-plus'
          }
        ]"
      />

      <div class="py-8">
        <section class="border-y border-default">
          <div class="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-muted">
                Blog posts
              </p>
              <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                Blog archive
              </h2>
              <p class="max-w-2xl text-sm leading-6 text-muted">
                Review published posts and drafts from one clean list.
              </p>
            </div>

            <UButton
              to="/blog"
              label="Open blog"
              icon="i-lucide-arrow-up-right"
              color="neutral"
              variant="outline"
              class="shrink-0"
            />
          </div>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="soft"
            :title="errorMessage"
            class="mb-6"
          />

          <div class="border-t border-default py-4">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search blog posts"
              aria-label="Search blog posts"
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
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-x"
                  aria-label="Clear blog search"
                  @click="searchQuery = ''"
                />
              </template>
            </UInput>
          </div>

          <div class="divide-y divide-default border-t border-default">
            <div
              v-for="post in posts"
              :key="post._id"
              class="group flex items-start gap-3 py-5 transition-colors hover:bg-elevated/35 sm:gap-5"
            >
              <NuxtLink
                :to="postEditorUrl(post._id)"
                class="flex min-w-0 flex-1 gap-4 sm:gap-5"
              >
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="h-20 w-24 shrink-0 object-cover sm:h-24 sm:w-36"
                >

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
                    <span>{{ formatPublishedAt(post.published_at) }}</span>
                    <span v-if="post.author.name">{{ post.author.name }}</span>
                    <UBadge
                      color="neutral"
                      variant="soft"
                      size="sm"
                    >
                      {{ post.status }}
                    </UBadge>
                  </div>

                  <h3 class="mt-1 line-clamp-2 text-base font-semibold tracking-[-0.01em] text-highlighted group-hover:text-primary sm:text-lg">
                    {{ post.title }}
                  </h3>

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
                      color="neutral"
                      variant="soft"
                      size="sm"
                    >
                      {{ tag }}
                    </UBadge>
                  </div>
                </div>

                <UIcon
                  name="i-lucide-pencil"
                  class="mt-1 hidden h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-primary sm:block"
                />
              </NuxtLink>

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

          <div class="flex min-h-20 items-center justify-center border-t border-default px-4 text-sm text-muted">
            <span v-if="isLoadingInitial">
              Loading posts...
            </span>
            <span v-else-if="isLoadingMore">
              Loading more posts...
            </span>
            <span v-else-if="activeSearchQuery && isDone && !posts.length">
              No blog posts match your search.
            </span>
            <span v-else-if="isDone && posts.length">
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
          Deleted posts are removed from the public blog and cannot be restored from this admin page.
        </p>
      </template>

      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            type="button"
            color="neutral"
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
