<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { useConvexMutation } from 'convex-vue'

const props = defineProps<{
  editItem?: Doc<'teamMembers'> | null
}>()

const open = defineModel<boolean>('open', {
  default: false
})

const form = reactive({
  name: '',
  role: '',
  bio: '',
  photoUrl: '',
  email: '',
  websiteUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  department: '',
  active: true,
  notes: ''
})

const submitError = ref('')

const photoInput = ref<HTMLInputElement | null>(null)
const photoFileName = ref('')
const photoError = ref('')

const { mutate: createTeamMember, isPending: createIsPending, error: createError } = useConvexMutation(api.teamMembers.create)
const { mutate: updateTeamMember, isPending: updateIsPending, error: updateError } = useConvexMutation(api.teamMembers.update)

const isEditMode = computed(() => !!props.editItem)
const isPending = computed(() => createIsPending.value || updateIsPending.value)

function trimOptional(value: string) {
  const trimmed = value.trim()
  return trimmed || undefined
}

function formFromItem(item: Doc<'teamMembers'>) {
  return {
    name: item.name,
    role: item.role,
    bio: item.bio ?? '',
    photoUrl: item.photoUrl ?? '',
    email: item.email ?? '',
    websiteUrl: item.websiteUrl ?? '',
    linkedinUrl: item.linkedinUrl ?? '',
    instagramUrl: item.instagramUrl ?? '',
    department: item.department ?? '',
    active: item.active,
    notes: item.notes ?? ''
  }
}

function resetForm() {
  form.name = ''
  form.role = ''
  form.bio = ''
  form.photoUrl = ''
  form.email = ''
  form.websiteUrl = ''
  form.linkedinUrl = ''
  form.instagramUrl = ''
  form.department = ''
  form.active = true
  form.notes = ''
  submitError.value = ''
  photoFileName.value = ''
  photoError.value = ''
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

function openPhotoPicker() {
  photoInput.value?.click()
}

function clearPhoto() {
  form.photoUrl = ''
  photoFileName.value = ''
  photoError.value = ''

  if (photoInput.value) {
    photoInput.value.value = ''
  }
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

async function handlePhotoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  photoError.value = ''

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    photoError.value = 'Please choose an image file'
    input.value = ''
    return
  }

  if (file.size > 700 * 1024) {
    photoError.value = 'Choose an image smaller than 700 KB'
    input.value = ''
    return
  }

  try {
    form.photoUrl = await fileToDataUrl(file)
    photoFileName.value = file.name
  } catch (error) {
    photoError.value = error instanceof Error ? error.message : 'Failed to read image file'
  } finally {
    input.value = ''
  }
}

async function submit() {
  const name = form.name.trim()
  const role = form.role.trim()

  if (!name) throw new Error('Name is required')
  if (!role) throw new Error('Role is required')

  if (isEditMode.value && props.editItem) {
    const payload = {
      id: props.editItem._id,
      name,
      role,
      active: form.active,
      ...(trimOptional(form.bio) ? { bio: trimOptional(form.bio) } : {}),
      ...(trimOptional(form.photoUrl) ? { photoUrl: trimOptional(form.photoUrl) } : {}),
      ...(trimOptional(form.email) ? { email: trimOptional(form.email) } : {}),
      ...(trimOptional(form.websiteUrl) ? { websiteUrl: trimOptional(form.websiteUrl) } : {}),
      ...(trimOptional(form.linkedinUrl) ? { linkedinUrl: trimOptional(form.linkedinUrl) } : {}),
      ...(trimOptional(form.instagramUrl) ? { instagramUrl: trimOptional(form.instagramUrl) } : {}),
      ...(trimOptional(form.department) ? { department: trimOptional(form.department) } : {}),
      ...(trimOptional(form.notes) ? { notes: trimOptional(form.notes) } : {})
    }

    await updateTeamMember({
      ...payload
    })
  } else {
    await createTeamMember({
      name,
      role,
      active: form.active,
      ...(trimOptional(form.bio) ? { bio: trimOptional(form.bio) } : {}),
      ...(trimOptional(form.photoUrl) ? { photoUrl: trimOptional(form.photoUrl) } : {}),
      ...(trimOptional(form.email) ? { email: trimOptional(form.email) } : {}),
      ...(trimOptional(form.websiteUrl) ? { websiteUrl: trimOptional(form.websiteUrl) } : {}),
      ...(trimOptional(form.linkedinUrl) ? { linkedinUrl: trimOptional(form.linkedinUrl) } : {}),
      ...(trimOptional(form.instagramUrl) ? { instagramUrl: trimOptional(form.instagramUrl) } : {}),
      ...(trimOptional(form.department) ? { department: trimOptional(form.department) } : {}),
      ...(trimOptional(form.notes) ? { notes: trimOptional(form.notes) } : {})
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

const displayError = computed(() => submitError.value || createError.value?.message || updateError.value?.message || '')

watch(open, (value) => {
  if (value && props.editItem) {
    Object.assign(form, formFromItem(props.editItem))
    submitError.value = ''
  } else if (!value) {
    resetForm()
  }
})

watch(() => props.editItem, (item) => {
  if (open.value && item) {
    Object.assign(form, formFromItem(item))
    submitError.value = ''
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditMode ? 'Edit team member' : 'Team member'"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UAlert
          v-if="displayError"
          color="error"
          variant="soft"
          :title="displayError"
        />

        <div class="grid gap-4">
          <div class="rounded-2xl border border-default/60 bg-elevated/20 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UIcon
                  name="i-lucide-users"
                  class="h-5 w-5"
                />
              </div>

              <div>
                <p class="text-xs uppercase tracking-[0.24em] text-muted">
                  Team record
                </p>
                <p class="text-sm text-muted">
                  Capture identity, role, contacts, and publishing state.
                </p>
              </div>
            </div>
          </div>

          <div class="grid gap-4">
            <UFormField
              label="Name"
              required
              class="w-full"
            >
              <UInput
                v-model="form.name"
                class="w-full"
                placeholder="Sreejith K. S"
              />
            </UFormField>

            <UFormField
              label="Role"
              required
              class="w-full"
            >
              <UInput
                v-model="form.role"
                class="w-full"
                placeholder="Producer, MD"
              />
            </UFormField>

            <UFormField
              label="Department"
              class="w-full"
            >
              <UInput
                v-model="form.department"
                class="w-full"
                placeholder="Production"
              />
            </UFormField>

            <UFormField
              label="Biography"
              class="w-full"
            >
              <UTextarea
                v-model="form.bio"
                class="w-full"
                :rows="5"
                placeholder="A concise bio for the admin list and detail page."
              />
            </UFormField>

            <UFormField
              label="Portrait image"
              class="w-full"
            >
              <div class="space-y-3 rounded-2xl border border-default/60 bg-elevated/10 p-4">
                <div class="flex items-center gap-4">
                  <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-default/60 bg-elevated/40">
                    <img
                      v-if="form.photoUrl"
                      :src="form.photoUrl"
                      alt="Selected profile image preview"
                      class="h-full w-full object-cover object-top"
                    >
                    <UIcon
                      v-else
                      name="i-lucide-image-plus"
                      class="h-6 w-6 text-muted"
                    />
                  </div>

                  <div class="min-w-0 flex-1 space-y-2">
                    <p class="text-sm font-medium text-highlighted">
                      Upload a profile image
                    </p>
                    <p class="text-sm leading-6 text-muted">
                      Choose a JPG, PNG, or WebP file and it will be stored with the team member record.
                    </p>

                    <div class="flex flex-wrap gap-2">
                      <UButton
                        color="neutral"
                        variant="outline"
                        size="sm"
                        label="Choose file"
                        @click="openPhotoPicker"
                      />

                      <UButton
                        v-if="form.photoUrl"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        label="Clear"
                        @click="clearPhoto"
                      />
                    </div>

                    <UAlert
                      v-if="photoError"
                      color="error"
                      variant="soft"
                      :title="photoError"
                    />

                    <p
                      v-if="photoFileName"
                      class="text-xs text-muted"
                    >
                      Selected: {{ photoFileName }}
                    </p>
                  </div>
                </div>

                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoChange"
                >
              </div>
            </UFormField>

            <div class="grid gap-4 rounded-2xl border border-default/60 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-muted">
                Contact links
              </p>

              <UFormField
                label="Email"
                class="w-full"
              >
                <UInput
                  v-model="form.email"
                  class="w-full"
                  type="email"
                  placeholder="hello@example.com"
                />
              </UFormField>

              <UFormField
                label="Website URL"
                class="w-full"
              >
                <UInput
                  v-model="form.websiteUrl"
                  class="w-full"
                  placeholder="https://..."
                />
              </UFormField>

              <UFormField
                label="LinkedIn URL"
                class="w-full"
              >
                <UInput
                  v-model="form.linkedinUrl"
                  class="w-full"
                  placeholder="https://linkedin.com/..."
                />
              </UFormField>

              <UFormField
                label="Instagram URL"
                class="w-full"
              >
                <UInput
                  v-model="form.instagramUrl"
                  class="w-full"
                  placeholder="https://instagram.com/..."
                />
              </UFormField>
            </div>

            <UFormField
              label="Notes"
              class="w-full"
            >
              <UTextarea
                v-model="form.notes"
                class="w-full"
                :rows="4"
                placeholder="Internal notes for the admin record."
              />
            </UFormField>

            <UFormField
              label="Active"
              class="w-full"
            >
              <div class="flex items-center justify-between rounded-2xl border border-default/60 px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">
                    Publish on team list
                  </p>
                  <p class="text-sm text-muted">
                    Toggle off to keep this person hidden from public lists.
                  </p>
                </div>

                <USwitch v-model="form.active" />
              </div>
            </UFormField>
          </div>
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
