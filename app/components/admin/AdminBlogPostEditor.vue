<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import type { EditorToolbarItem } from '@nuxt/ui'
import Placeholder from '@tiptap/extension-placeholder'
import { markRaw } from 'vue'
import { useConvexClient } from 'convex-vue'

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

const props = defineProps<{
  post?: BlogPost | null
  mode: 'create' | 'edit'
}>()

const convex = useConvexClient()
const toast = useToast()

const title = ref('')
const content = ref('')
const slug = ref('')
const description = ref('')
const image = ref('')
const status = ref('published')
const publishedDate = ref('')
const tags = ref('')
const authorName = ref('')
const authorEmail = ref('')
const authorPhoto = ref('')
const authorUid = ref('')
const isSaving = ref(false)
const errorMessage = ref('')
const isDetailsOpen = ref(false)

const isEditMode = computed(() => props.mode === 'edit')
const saveLabel = computed(() => isEditMode.value ? 'Save changes' : 'Create post')

const extensions = [
  markRaw(Placeholder.configure({
    placeholder: 'Start writing the blog post...'
  }))
]

const toolbarItems: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { kind: 'link', icon: 'i-lucide-link' },
  { kind: 'horizontalRule', label: '', icon: 'i-lucide-separator-horizontal' }
]

const editorUi = {
  base: 'flex-1 min-w-0 w-full max-w-none focus:outline-none',
  content: 'mx-auto w-full max-w-3xl break-words px-4 pb-24 pt-8 prose prose-primary dark:prose-invert sm:px-6 lg:px-8'
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDateInput(value: unknown) {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  const date = value instanceof Date ? value : new Date(value as string | number)

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function nodeText(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(nodeText).filter(Boolean).join('')

  if (isRecord(value)) {
    return nodeText(value.text ?? value.content ?? value.children ?? value.value ?? '')
  }

  return ''
}

function tiptapNodeToMarkdown(node: unknown): string {
  if (!isRecord(node)) {
    return nodeText(node)
  }

  const type = String(node.type ?? node.kind ?? '').toLowerCase()
  const children = Array.isArray(node.content) ? node.content : Array.isArray(node.children) ? node.children : []
  const text = nodeText(node.text ?? node.value ?? node.content ?? node.children ?? '')

  if (type === 'doc') {
    return children.map(tiptapNodeToMarkdown).filter(Boolean).join('\n\n')
  }

  if (type === 'heading') {
    const attrs = isRecord(node.attrs) ? node.attrs : {}
    const level = Math.min(Math.max(Number(attrs.level ?? node.level ?? 2), 1), 6)
    return `${'#'.repeat(level)} ${text}`
  }

  if (type === 'paragraph') {
    return text
  }

  if (type === 'blockquote') {
    return children
      .map(tiptapNodeToMarkdown)
      .join('\n')
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n')
  }

  if (type === 'bulletlist') {
    return children.map(child => `- ${nodeText(child)}`).join('\n')
  }

  if (type === 'orderedlist') {
    return children.map((child, index) => `${index + 1}. ${nodeText(child)}`).join('\n')
  }

  if (type === 'listitem') {
    return text
  }

  if (type === 'horizontalrule') {
    return '---'
  }

  if (type === 'image') {
    const attrs = isRecord(node.attrs) ? node.attrs : {}
    const src = String(attrs.src ?? node.src ?? '')
    const alt = String(attrs.alt ?? node.alt ?? '')
    return src ? `![${alt}](${src})` : ''
  }

  if (children.length) {
    return children.map(tiptapNodeToMarkdown).filter(Boolean).join('\n\n')
  }

  return text
}

function contentToMarkdown(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) {
      return ''
    }

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return contentToMarkdown(JSON.parse(trimmed) as unknown)
      } catch {
        return value
      }
    }

    return value
  }

  if (Array.isArray(value)) {
    return value.map(tiptapNodeToMarkdown).filter(Boolean).join('\n\n')
  }

  if (isRecord(value)) {
    return tiptapNodeToMarkdown(value)
  }

  return ''
}

function parseTags(value: string) {
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
}

function fillFromPost(post: BlogPost | null | undefined) {
  title.value = post?.title ?? ''
  slug.value = post?.slug ?? ''
  description.value = post?.description ?? ''
  image.value = post?.image ?? ''
  status.value = post?.status ?? 'published'
  publishedDate.value = formatDateInput(post?.published_at)
  tags.value = post?.tags.join(', ') ?? ''
  authorName.value = post?.author.name ?? ''
  authorEmail.value = post?.author.email ?? ''
  authorPhoto.value = post?.author.photo ?? ''
  authorUid.value = post?.author.uid ?? ''
  content.value = contentToMarkdown(post?.content)
  errorMessage.value = ''
}

function buildPayload() {
  const trimmedTitle = title.value.trim()
  const currentSlug = normalizeSlug(slug.value || trimmedTitle)
  const currentDescription = description.value.trim() || content.value.trim().slice(0, 180) || trimmedTitle
  const currentImage = image.value.trim() || props.post?.image || ''
  const currentAuthorName = authorName.value.trim() || props.post?.author.name || 'Manasa'
  const currentPublishedDate = publishedDate.value || formatDateInput(props.post?.published_at)

  if (!trimmedTitle) throw new Error('Title is required.')
  if (!currentSlug) throw new Error('Slug is required.')

  return {
    title: trimmedTitle,
    slug: currentSlug,
    description: currentDescription,
    image: currentImage,
    status: status.value || props.post?.status || 'published',
    tags: parseTags(tags.value),
    published_at: new Date(`${currentPublishedDate}T00:00:00.000Z`).toISOString(),
    content: content.value,
    author: {
      name: currentAuthorName,
      email: authorEmail.value.trim(),
      photo: authorPhoto.value.trim(),
      uid: authorUid.value.trim()
    }
  }
}

function useTitleForSlug() {
  slug.value = normalizeSlug(title.value)
}

async function savePost() {
  if (isSaving.value) {
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    const payload = buildPayload()

    if (isEditMode.value && props.post) {
      await convex.mutation(api.posts.update, {
        id: props.post._id,
        ...payload
      })
    } else {
      const id = await convex.mutation(api.posts.create, payload)
      await navigateTo(`/admin/blog/${id}`)
    }

    toast.add({
      title: isEditMode.value ? 'Blog post updated' : 'Blog post created',
      color: 'success'
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save blog post.'
  } finally {
    isSaving.value = false
  }
}

watch(() => props.post, fillFromPost, { immediate: true })

watch(title, (newTitle) => {
  if (!slug.value && newTitle) {
    slug.value = normalizeSlug(newTitle)
  }
})
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="savePost"
  >
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      :title="errorMessage"
    />

    <div class="flex min-h-[calc(100vh-11rem)] w-full min-w-0 flex-col overflow-hidden border border-muted/40 bg-default">
      <UEditor
        v-slot="{ editor }"
        v-model="content"
        :extensions="extensions"
        content-type="markdown"
        class="flex min-w-0 flex-1 flex-col"
        :ui="editorUi"
      >
        <div class="sticky top-0 z-20 min-w-0 border-b border-muted bg-default/90 backdrop-blur">
          <div class="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <UTextarea
                v-model="title"
                variant="none"
                class="min-w-0 flex-1 text-3xl font-bold text-highlighted sm:text-4xl"
                :rows="1"
                autoresize
                :ui="{ base: 'p-0 min-h-0 resize-none' }"
              />

              <div class="flex shrink-0 flex-wrap items-center gap-2">
                <UButton
                  color="neutral"
                  variant="soft"
                  size="sm"
                  icon="i-lucide-settings"
                  @click="isDetailsOpen = true"
                >
                  Settings
                </UButton>

                <UButton
                  type="submit"
                  color="primary"
                  size="sm"
                  :loading="isSaving"
                  icon="i-lucide-save"
                >
                  {{ saveLabel }}
                </UButton>
              </div>
            </div>
          </div>

          <div class="border-t border-muted bg-default px-3 py-2">
            <UEditorToolbar
              :editor="editor"
              :items="toolbarItems"
              class="mx-auto flex-wrap justify-center overflow-x-auto"
              :ui="{ group: 'flex-wrap' }"
            />
          </div>
        </div>
      </UEditor>
    </div>

    <USlideover
      v-model:open="isDetailsOpen"
      title="Post Settings"
      description="Manage post metadata."
    >
      <template #body>
        <div class="flex flex-col gap-6 p-4">
          <UFormField
            name="slug"
            label="Slug"
          >
            <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <UInput
                v-model="slug"
                class="w-full"
              />
              <UButton
                color="neutral"
                variant="outline"
                label="Use title"
                icon="i-lucide-sparkles"
                @click="useTitleForSlug"
              />
            </div>
          </UFormField>

          <UFormField
            name="description"
            label="Description"
          >
            <UTextarea
              v-model="description"
              autoresize
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="image"
            label="Featured Image URL"
          >
            <UInput
              v-model="image"
              icon="i-lucide-image"
              class="w-full"
            />
          </UFormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
              name="status"
              label="Status"
            >
              <USelect
                v-model="status"
                :items="['published', 'draft']"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="publishedDate"
              label="Published date"
            >
              <UInput
                v-model="publishedDate"
                type="date"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton
          color="neutral"
          variant="ghost"
          @click="isDetailsOpen = false"
        >
          Close
        </UButton>
      </template>
    </USlideover>
  </form>
</template>

<style scoped>
:deep(.tiptap) {
  outline: none;
}
</style>
