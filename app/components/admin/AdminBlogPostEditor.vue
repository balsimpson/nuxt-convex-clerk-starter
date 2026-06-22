<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import { Youtube } from '@tiptap/extension-youtube'
import { ImageUpload } from '~/utils/EditorImageUploadExtension'
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
const titleTextarea = ref<HTMLTextAreaElement | null>(null)

const isEditMode = computed(() => props.mode === 'edit')
const saveLabel = computed(() => isEditMode.value ? 'Save changes' : 'Create post')
const publicPostUrl = computed(() => isEditMode.value && props.post?.slug ? `/blog/${props.post.slug}` : '')
const editorColumnClass = 'w-full px-5 sm:px-8 lg:px-10'

const extensions = [
  markRaw(ImageUpload),
  markRaw(Youtube.configure({ inline: false, controls: true })),
  markRaw(Placeholder.configure({
    placeholder: 'Write the blog post.'
  }))
]

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
  youtubeEmbed: {
    canExecute: () => true,
    execute: (editor: Editor) => {
      const url = prompt('Enter YouTube video URL:')
      if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
    },
    isActive: (editor: Editor) => editor.isActive('youtube'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const toolbarItems: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
  { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left' },
  { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { kind: 'link', icon: 'i-lucide-link' },
  { kind: 'horizontalRule', label: '', icon: 'i-lucide-separator-horizontal' },
  { kind: 'imageUpload', icon: 'i-lucide-image', label: 'Add image', variant: 'soft' },
  { kind: 'youtubeEmbed', icon: 'i-lucide-youtube', label: 'Embed video', variant: 'soft' }
]

const editorUi = {
  base: 'flex-1 min-w-0 w-full max-w-none focus:outline-none',
  content: `${editorColumnClass} max-w-none break-words pb-24 pt-8 prose prose-lg prose-primary dark:prose-invert`
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

function resizeTitleTextarea() {
  const element = titleTextarea.value
  if (!element) return

  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
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

  nextTick(resizeTitleTextarea)
})

onMounted(() => {
  nextTick(resizeTitleTextarea)
})
</script>

<template>
  <form
    class="min-w-0"
    @submit.prevent="savePost"
  >
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      :title="errorMessage"
      class="mx-auto mb-4 w-full max-w-3xl"
    />

    <div class="flex min-h-[calc(100vh-5rem)] w-full min-w-0 flex-col overflow-hidden border-y border-[#d9c9b7]/80 bg-[#fffaf2]">
      <UEditor
        v-slot="{ editor }"
        v-model="content"
        :extensions="extensions"
        :handlers="customHandlers"
        content-type="markdown"
        class="flex min-w-0 flex-1 flex-col"
        :ui="editorUi"
      >
        <div class="sticky top-0 z-30 min-w-0 border-b border-[#d9c9b7]/80 bg-[#fbf7ef]/95 backdrop-blur">
          <div
            :class="editorColumnClass"
            class="flex flex-col gap-3 py-3"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <UButton
                to="/admin"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-arrow-left"
                class="w-fit -ml-2"
              >
                Posts
              </UButton>

              <div class="flex shrink-0 flex-wrap items-center gap-2">
                <UButton
                  v-if="publicPostUrl"
                  :to="publicPostUrl"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  icon="i-lucide-arrow-up-right"
                >
                  Preview
                </UButton>

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

          <div class="border-t border-[#d9c9b7]/70 bg-[#fffaf2]">
            <div
              :class="editorColumnClass"
              class="py-2"
            >
              <UEditorToolbar
                :editor="editor"
                :items="toolbarItems"
                class="-mx-1 flex-wrap justify-start overflow-x-auto"
                :ui="{ group: 'flex-wrap' }"
              />
            </div>
          </div>
        </div>

        <div
          :class="editorColumnClass"
          class="pt-12 sm:pt-16"
        >
          <label
            for="blog-post-title"
            class="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#8d7159]"
          >
            <UIcon
              name="i-lucide-pencil"
              class="h-3.5 w-3.5"
            />
            Post title
          </label>

          <textarea
            id="blog-post-title"
            ref="titleTextarea"
            v-model="title"
            placeholder="Title"
            aria-label="Post title"
            rows="1"
            class="block min-h-0 w-full resize-none overflow-hidden rounded-none border-0 border-b border-dashed border-[#c8b29d] bg-transparent p-0 pb-4 font-serif text-[2.75rem] font-semibold leading-[1.12] tracking-normal text-[#2f2118] shadow-none outline-none placeholder:text-[#9a8068]/70 focus:border-[#6f4a32] focus:ring-0 sm:text-[3.5rem] lg:text-[4.25rem]"
            @input="resizeTitleTextarea"
          />
        </div>
      </UEditor>
    </div>

    <USlideover
      v-model:open="isDetailsOpen"
      title="Post settings"
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
