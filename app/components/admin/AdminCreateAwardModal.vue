<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import { useConvexMutation } from 'convex-vue'

const open = defineModel<boolean>('open', {
  default: false
})

const form = reactive({
  title: '',
  organization: '',
  projectName: '',
  category: '',
  result: '',
  year: '',
  description: '',
  link: '',
  featured: false,
  notes: ''
})

const { mutate: createAward, isPending, error } = useConvexMutation(api.awards.create)

function resetForm() {
  form.title = ''
  form.organization = ''
  form.projectName = ''
  form.category = ''
  form.result = ''
  form.year = ''
  form.description = ''
  form.link = ''
  form.featured = false
  form.notes = ''
}

function parseRequiredNumber(value: string | number, label: string) {
  const normalized = typeof value === 'string' ? value.trim() : value
  const parsed = Number(normalized)

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a valid number`)
  }

  return parsed
}

async function submit() {
  const title = form.title.trim()
  const organization = form.organization.trim()

  if (!title) throw new Error('Title is required')
  if (!organization) throw new Error('Organization is required')

  await createAward({
    title,
    organization,
    year: parseRequiredNumber(form.year, 'Year'),
    featured: form.featured,
    ...(form.projectName.trim() ? { projectName: form.projectName.trim() } : {}),
    ...(form.category.trim() ? { category: form.category.trim() } : {}),
    ...(form.result.trim() ? { result: form.result.trim() } : {}),
    ...(form.description.trim() ? { description: form.description.trim() } : {}),
    ...(form.link.trim() ? { link: form.link.trim() } : {}),
    ...(form.notes.trim() ? { notes: form.notes.trim() } : {})
  })

  resetForm()
  open.value = false
}

function closeModal(close: () => void) {
  resetForm()
  close()
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Award"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error.message"
        />

        <div class="grid gap-4">
          <div class="rounded-2xl border border-default/60 bg-elevated/20 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UIcon
                  name="i-lucide-trophy"
                  class="h-5 w-5"
                />
              </div>

              <div>
                <p class="text-xs uppercase tracking-[0.24em] text-muted">
                  Award record
                </p>
                <p class="text-sm text-muted">
                  Capture the organization, result, and award context as structured data.
                </p>
              </div>
            </div>
          </div>

          <div class="grid gap-4">
            <UFormField
              label="Title"
              required
              class="w-full"
            >
              <UInput
                v-model="form.title"
                class="w-full"
                placeholder="Best Production Design"
              />
            </UFormField>

            <UFormField
              label="Organization"
              required
              class="w-full"
            >
              <UInput
                v-model="form.organization"
                class="w-full"
                placeholder="D&AD"
              />
            </UFormField>

            <UFormField
              label="Year"
              required
              class="w-full"
            >
              <UInput
                v-model="form.year"
                class="w-full"
                type="number"
                placeholder="2026"
              />
            </UFormField>

            <UFormField
              label="Project name"
              class="w-full"
            >
              <UInput
                v-model="form.projectName"
                class="w-full"
                placeholder="Medimix Ft Nadhiya Moidu"
              />
            </UFormField>

            <UFormField
              label="Category"
              class="w-full"
            >
              <UInput
                v-model="form.category"
                class="w-full"
                placeholder="Film craft"
              />
            </UFormField>

            <UFormField
              label="Result"
              class="w-full"
            >
              <UInput
                v-model="form.result"
                class="w-full"
                placeholder="Winner"
              />
            </UFormField>

            <UFormField
              label="Description"
              class="w-full"
            >
              <UTextarea
                v-model="form.description"
                class="w-full"
                :rows="4"
                placeholder="Short context for the award entry."
              />
            </UFormField>

            <UFormField
              label="Reference link"
              class="w-full"
            >
              <UInput
                v-model="form.link"
                class="w-full"
                placeholder="https://..."
              />
            </UFormField>

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
              label="Featured"
              class="w-full"
            >
              <div class="flex items-center justify-between rounded-2xl border border-default/60 px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-highlighted">
                    Mark as featured
                  </p>
                  <p class="text-sm text-muted">
                    Featured awards stay easier to surface in lists.
                  </p>
                </div>

                <USwitch v-model="form.featured" />
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
        label="Save"
        :loading="isPending"
        @click="submit"
      />
    </template>
  </UModal>
</template>
