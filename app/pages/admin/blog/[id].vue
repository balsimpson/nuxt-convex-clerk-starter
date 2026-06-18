<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
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
  content: unknown
  author: {
    name: string
    email: string
    photo: string
    uid: string
  }
}

const route = useRoute()
const convex = useConvexClient()

const post = ref<BlogPost | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const postId = computed(() => {
  const value = route.params.id
  return (Array.isArray(value) ? value[0] : value) as Id<'posts'> | undefined
})

const headerLinks = computed<ButtonProps[]>(() => {
  const links: ButtonProps[] = [
    {
      label: 'Back to posts',
      to: '/admin',
      color: 'neutral',
      variant: 'outline',
      icon: 'i-lucide-arrow-left'
    }
  ]

  if (post.value?.slug) {
    links.push({
      label: 'View public post',
      to: `/blog/${post.value.slug}`,
      color: 'neutral',
      variant: 'outline',
      icon: 'i-lucide-arrow-up-right'
    })
  }

  return links
})

onMounted(async () => {
  if (!postId.value) {
    errorMessage.value = 'Missing blog post id.'
    isLoading.value = false
    return
  }

  try {
    post.value = await convex.query(api.posts.getForAdmin, { id: postId.value }) as BlogPost | null

    if (!post.value) {
      errorMessage.value = 'This blog post could not be found.'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load blog post.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <UPageHeader
        headline="Admin"
        title="Edit blog post"
        :links="headerLinks"
      />

      <div class="py-8">
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :title="errorMessage"
        />

        <div
          v-else-if="isLoading"
          class="flex min-h-48 items-center justify-center border-y border-default text-sm text-muted"
        >
          Loading blog post...
        </div>

        <AdminBlogPostEditor
          v-else-if="post"
          mode="edit"
          :post="post"
        />
      </div>
    </div>
  </UPage>
</template>
