<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import type { TeamCategory, TeamListItem } from '../../../convex/team'
import { useConvexClient, useConvexMutation } from 'convex-vue'

const props = defineProps<{
  editItem?: TeamListItem | null
  category?: TeamCategory | null
}>()

const open = defineModel<boolean>('open', {
  default: false
})

const categoryItems: TeamCategory[] = ['Board Member', 'Staff', 'Co-ordinator', 'Founder', 'Executive Director']
const defaultCategory: TeamCategory = 'Board Member'

const convex = useConvexClient()

const form = reactive<{ fullname: string, designation: string, bio: string, category: TeamCategory }>({
  fullname: '',
  designation: '',
  bio: '',
  category: defaultCategory
})

const imageInput = ref<HTMLInputElement | null>(null)
const selectedImageFile = ref<File | null>(null)
const selectedImageName = ref('')
const selectedImagePreview = ref('')
const currentImageStorageId = ref<Id<'_storage'> | null>(null)
const currentImageUrl = ref('')

const submitError = ref('')
const imageError = ref('')
const { mutate: createTeamMember, isPending: createIsPending, error: createError } = useConvexMutation(api.team.create)
const { mutate: updateTeamMember, isPending: updateIsPending, error: updateError } = useConvexMutation(api.team.update)

const isEditMode = computed(() => !!props.editItem)
const isPending = computed(() => createIsPending.value || updateIsPending.value)
const previewImageUrl = computed(() => selectedImagePreview.value || currentImageUrl.value)

function trimValue(value: string) {
  return value.trim()
}

function formFromItem(item: TeamListItem) {
  return {
    fullname: item.fullname,
    designation: item.designation,
    bio: item.bio,
    category: item.category
  }
}

function resetImageState() {
  selectedImageFile.value = null
  selectedImageName.value = ''
  selectedImagePreview.value = ''
  imageError.value = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

function resetForm() {
  form.fullname = ''
  form.designation = ''
  form.bio = ''
  form.category = props.category ?? defaultCategory
  currentImageStorageId.value = null
  currentImageUrl.value = ''
  resetImageState()
  submitError.value = ''
}

function openImagePicker() {
  imageInput.value?.click()
}

function clearSelectedImage() {
  resetImageState()
  selectedImagePreview.value = currentImageUrl.value
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read image file'))
      }
    }

    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

async function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  imageError.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    imageError.value = 'Please choose an image file'
    input.value = ''
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    imageError.value = 'Choose an image smaller than 2 MB'
    input.value = ''
    return
  }

  try {
    selectedImageFile.value = file
    selectedImageName.value = file.name
    selectedImagePreview.value = await fileToDataUrl(file)
  } catch (error) {
    imageError.value = error instanceof Error ? error.message : 'Failed to read image file'
  } finally {
    input.value = ''
  }
}

async function uploadImageIfNeeded() {
  if (selectedImageFile.value) {
    const uploadUrl = await convex.mutation(api.team.generateUploadUrl, {})
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: selectedImageFile.value
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const payload = await response.json() as { storageId?: Id<'_storage'> }
    if (!payload.storageId) {
      throw new Error('Upload did not return a file id')
    }

    return payload.storageId
  }

  if (currentImageStorageId.value) {
    return currentImageStorageId.value
  }

  throw new Error('Image is required')
}

async function submit() {
  const fullname = trimValue(form.fullname)
  const designation = trimValue(form.designation)
  const bio = trimValue(form.bio)
  const category = form.category

  if (!fullname) throw new Error('Full name is required')
  if (!designation) throw new Error('Designation is required')

  const imageStorageId = await uploadImageIfNeeded()

  if (isEditMode.value && props.editItem) {
    await updateTeamMember({
      id: props.editItem._id,
      fullname,
      designation,
      bio,
      imageStorageId,
      category
    })
  } else {
    await createTeamMember({
      fullname,
      designation,
      bio,
      imageStorageId,
      category
    })
  }

  resetForm()
  open.value = false
}

function saveTeamMember() {
  submitError.value = ''

  submit().catch((error) => {
    submitError.value = error instanceof Error ? error.message : 'Failed to save team member'
  })
}

function closeModal(close: () => void) {
  resetForm()
  close()
}

const displayError = computed(() => submitError.value || imageError.value || createError.value?.message || updateError.value?.message || '')

watch(open, (value) => {
  if (value && props.editItem) {
    Object.assign(form, formFromItem(props.editItem))
    currentImageStorageId.value = props.editItem.imageStorageId ?? null
    currentImageUrl.value = props.editItem.imageUrl
    resetImageState()
    selectedImagePreview.value = props.editItem.imageUrl
    submitError.value = ''
  } else if (value) {
    resetForm()
  } else if (!value) {
    resetForm()
  }
})

watch(() => props.editItem, (item) => {
  if (open.value && item) {
    Object.assign(form, formFromItem(item))
    currentImageStorageId.value = item.imageStorageId ?? null
    currentImageUrl.value = item.imageUrl
    resetImageState()
    selectedImagePreview.value = item.imageUrl
    submitError.value = ''
  }
})

watch(() => props.category, (category) => {
  if (open.value && !props.editItem) {
    form.category = category ?? defaultCategory
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditMode ? 'Edit team member' : 'Add team member'"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-5">
        <UAlert
          v-if="displayError"
          color="error"
          variant="soft"
          :title="displayError"
        />

        <div class="grid gap-4">
          <UFormField
            label="Full name"
            required
            class="w-full"
          >
            <UInput
              v-model="form.fullname"
              class="w-full"
              placeholder="Sreejith K. S"
            />
          </UFormField>

          <UFormField
            label="Designation"
            required
            class="w-full"
          >
            <UInput
              v-model="form.designation"
              class="w-full"
              placeholder="Executive Director"
            />
          </UFormField>

          <UFormField
            label="Category"
            required
            class="w-full"
          >
            <USelect
              v-model="form.category"
              class="w-full"
              :items="categoryItems"
            />
          </UFormField>

          <UFormField
            label="Biography"
            help="Shown on the public about page."
            class="w-full"
          >
            <UTextarea
              v-model="form.bio"
              class="w-full"
              :rows="5"
            />
          </UFormField>

          <UFormField
            label="Image"
            help="Choose a JPG, PNG, or WebP file."
            required
            class="w-full"
          >
            <div class="flex gap-4">
              <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-default/60 bg-elevated/30">
                <img
                  v-if="previewImageUrl"
                  :src="previewImageUrl"
                  alt="Selected team image preview"
                  class="h-full w-full object-cover object-top"
                >
                <UIcon
                  v-else
                  name="i-lucide-image-plus"
                  class="h-6 w-6 text-muted"
                />
              </div>

              <div class="min-w-0 flex-1 space-y-2">
                <div class="flex flex-wrap gap-2">
                  <UButton
                    color="neutral"
                    variant="outline"
                    size="sm"
                    icon="i-lucide-upload"
                    label="Choose file"
                    @click="openImagePicker"
                  />

                  <UButton
                    v-if="previewImageUrl"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-x"
                    label="Clear"
                    @click="clearSelectedImage"
                  />
                </div>

                <p
                  v-if="selectedImageName"
                  class="break-words text-xs text-muted"
                >
                  Selected: {{ selectedImageName }}
                </p>
              </div>
            </div>

            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            >
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        color="neutral"
        variant="outline"
        label="Close"
        @click="closeModal(close)"
      />

      <UButton
        color="primary"
        :label="isEditMode ? 'Update' : 'Save'"
        :loading="isPending"
        @click="saveTeamMember"
      />
    </template>
  </UModal>
</template>
