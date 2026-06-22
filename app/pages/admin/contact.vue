<script setup lang="ts">
import { api } from '../../../convex/_generated/api'
import type { ContactSettings } from '../../../convex/contact'
import { useConvexMutation, useConvexQuery } from 'convex-vue'

definePageMeta({
  layout: 'admin'
})

const toast = useToast()

const form = reactive({
  addressLines: '',
  phoneNumbers: '',
  emails: '',
  officeHours: ''
})

const hasHydratedForm = ref(false)
const saveError = ref('')

const {
  data: contactSettings,
  isPending: isLoadingSettings,
  error: loadError
} = useConvexQuery(api.contact.getSettings, {})

const {
  mutate: updateContactSettings,
  isPending: isSaving,
  error: mutationError
} = useConvexMutation(api.contact.updateSettings)

function linesToText(lines: string[]) {
  return lines.join('\n')
}

function textToLines(value: string) {
  return value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
}

function hydrateForm(settings: ContactSettings) {
  form.addressLines = linesToText(settings.addressLines)
  form.phoneNumbers = linesToText(settings.phoneNumbers)
  form.emails = linesToText(settings.emails)
  form.officeHours = linesToText(settings.officeHours)
  hasHydratedForm.value = true
}

const displayError = computed(() => saveError.value || mutationError.value?.message || loadError.value?.message || '')

const updatedAtLabel = computed(() => {
  const updatedAt = contactSettings.value?.updatedAt

  if (!updatedAt) {
    return 'Using default contact details'
  }

  return `Last updated ${new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(updatedAt))}`
})

async function saveContactSettings() {
  saveError.value = ''

  try {
    await updateContactSettings({
      addressLines: textToLines(form.addressLines),
      phoneNumbers: textToLines(form.phoneNumbers),
      emails: textToLines(form.emails),
      officeHours: textToLines(form.officeHours)
    })

    toast.add({
      title: 'Contact details saved',
      color: 'success'
    })
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Failed to save contact details.'
  }
}

watch(contactSettings, (settings) => {
  if (settings && !hasHydratedForm.value) {
    hydrateForm(settings)
  }
}, { immediate: true })
</script>

<template>
  <UPage>
    <div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <UPageHeader
        headline="Admin"
        title="Contact details"
        description="Edit the address, phone numbers, email addresses, and office hours shown on the contact page."
        :links="[
          {
            label: 'Open contact page',
            to: '/contact-us',
            color: 'primary',
            variant: 'outline',
            icon: 'i-lucide-arrow-up-right'
          }
        ]"
      />

      <div class="py-8">
        <section class="border-y border-default py-6">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.28em] text-muted">
                Public contact page
              </p>
              <h2 class="text-2xl font-semibold tracking-[-0.03em] text-highlighted">
                Editable information
              </h2>
              <p class="max-w-2xl text-sm leading-6 text-muted">
                Enter one address line, phone number, email address, or office-hours note per line.
              </p>
            </div>

            <UBadge
              color="primary"
              variant="soft"
              class="self-start sm:self-auto"
            >
              {{ updatedAtLabel }}
            </UBadge>
          </div>

          <UAlert
            v-if="displayError"
            color="error"
            variant="soft"
            :title="displayError"
            class="mt-6"
          />

          <div
            v-if="isLoadingSettings && !hasHydratedForm"
            class="mt-8 grid gap-5 sm:grid-cols-2"
          >
            <div
              v-for="index in 4"
              :key="index"
              class="h-44 animate-pulse rounded bg-elevated/70"
            />
          </div>

          <form
            v-else
            class="mt-8 grid gap-5 sm:grid-cols-2"
            @submit.prevent="saveContactSettings"
          >
            <UFormField
              label="Address"
              description="Shown in the Address section."
              class="sm:col-span-2"
            >
              <UTextarea
                v-model="form.addressLines"
                :rows="5"
                autoresize
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Phone numbers"
              description="Each line becomes a tappable phone link."
            >
              <UTextarea
                v-model="form.phoneNumbers"
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Email addresses"
              description="Each line becomes a mail link."
            >
              <UTextarea
                v-model="form.emails"
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Office hours"
              description="Shown as separate lines under Office Hours."
              class="sm:col-span-2"
            >
              <UTextarea
                v-model="form.officeHours"
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>

            <div class="flex flex-col-reverse gap-2 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
              <UButton
                type="button"
                color="primary"
                variant="outline"
                to="/contact-us"
              >
                Preview contact page
              </UButton>

              <UButton
                type="submit"
                color="primary"
                icon="i-lucide-save"
                :loading="isSaving"
              >
                Save contact details
              </UButton>
            </div>
          </form>
        </section>
      </div>
    </div>
  </UPage>
</template>
