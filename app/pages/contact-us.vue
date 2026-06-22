<template>
  <div class="min-h-screen bg-[#fbf7ef] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 pb-[4.5rem] pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
      <div class="mx-auto max-w-7xl">
        <UBreadcrumb
          :items="breadcrumbItems"
          separator-icon="i-lucide-chevron-right"
          class="mb-8 text-[#4f4134]"
        />

        <section class="border-b border-[#d9c9b7] pb-12 lg:pb-16">
          <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
            <div class="max-w-2xl">
              <!-- <p class="text-xs font-semibold uppercase text-[#5f3724]">
                Contact Us
              </p> -->

              <h1 class="mt-4 font-serif text-5xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-6xl lg:text-7xl xl:text-8xl">
                Reach <span class="font-bold">Manasa</span>
              </h1>

              <p class="mt-7 max-w-2xl text-base leading-8 text-[#4f4134] sm:text-lg">
                Use the details below to reach our office, or send a message through the form and we will get back to you.
              </p>
            </div>
          </div>
        </section>

        <section class="py-12 lg:py-16">
          <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div class="pt-8 lg:border-t-0">
              <UAlert
                v-if="submitSuccess"
                color="success"
                variant="soft"
                :title="submitSuccess"
                class="mb-6"
              />

              <UAlert
                v-if="displayError"
                color="error"
                variant="soft"
                :title="displayError"
                class="mb-6"
              />

              <form
                class="grid gap-4 sm:grid-cols-2"
                @submit.prevent="submitContactForm"
              >
                <UFormField
                  label="Full name"
                  required
                  class="w-full sm:col-span-1"
                >
                  <UInput
                    v-model="contactForm.name"
                    required
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Email address"
                  class="w-full sm:col-span-1"
                >
                  <UInput
                    v-model="contactForm.email"
                    type="email"
                    placeholder="you@example.com"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Phone number"
                  class="w-full sm:col-span-1"
                >
                  <UInput
                    v-model="contactForm.phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Message"
                  required
                  class="w-full sm:col-span-2"
                >
                  <UTextarea
                    v-model="contactForm.message"
                    :rows="6"
                    required
                    class="w-full"
                  />
                </UFormField>

                <div class="pt-2 sm:col-span-2">
                  <UButton
                    type="submit"
                    color="neutral"
                    variant="solid"
                    :loading="isPending"
                    label="Submit message"
                    class="rounded-none border border-[#2f2118] bg-[#2f2118] px-5 py-3 text-sm font-medium text-[#fbf7ef] hover:bg-[#4b3324]"
                  />
                </div>
              </form>
            </div>

            <div class="border-t border-[#d9c9b7] pt-8 lg:border-t-0 lg:border-l lg:pl-8">
              <div class="space-y-6">
                <div v-if="contactSettings.addressLines.length">
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Address
                  </p>
                  <p class="mt-3 text-sm leading-7 text-[#4f4134]">
                    <template
                      v-for="(line, index) in contactSettings.addressLines"
                      :key="`${line}-${index}`"
                    >
                      {{ line }}
                      <br v-if="index < contactSettings.addressLines.length - 1">
                    </template>
                  </p>
                </div>

                <div
                  v-if="contactSettings.phoneNumbers.length"
                  class="border-t border-[#d9c9b7] pt-6"
                >
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Phone
                  </p>
                  <div class="mt-3 space-y-2 text-sm leading-7 text-[#4f4134]">
                    <a
                      v-for="phone in contactSettings.phoneNumbers"
                      :key="phone"
                      :href="phoneHref(phone)"
                      class="block transition hover:text-[#8f6240]"
                    >
                      {{ phone }}
                    </a>
                  </div>
                </div>

                <div
                  v-if="contactSettings.emails.length"
                  class="border-t border-[#d9c9b7] pt-6"
                >
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Email
                  </p>
                  <div class="mt-3 space-y-2 text-sm leading-7 text-[#4f4134]">
                    <a
                      v-for="email in contactSettings.emails"
                      :key="email"
                      :href="`mailto:${email}`"
                      class="block transition hover:text-[#8f6240]"
                    >
                      {{ email }}
                    </a>
                  </div>
                </div>

                <div
                  v-if="contactSettings.officeHours.length"
                  class="border-t border-[#d9c9b7] pt-6"
                >
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Office Hours
                  </p>
                  <div class="mt-3 space-y-3 text-sm leading-7 text-[#4f4134]">
                    <p
                      v-for="line in contactSettings.officeHours"
                      :key="line"
                    >
                      {{ line }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { api } from '../../convex/_generated/api'
import type { ContactSettings } from '../../convex/contact'
import { useConvexMutation, useConvexQuery } from 'convex-vue'

const breadcrumbItems = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Contact Us'
  }
] satisfies BreadcrumbItem[]

const contactForm = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitSuccess = ref('')
const submitError = ref('')

const emptyContactSettings: ContactSettings = {
  addressLines: [],
  phoneNumbers: [],
  emails: [],
  officeHours: [],
  updatedAt: null
}

const { data: savedContactSettings } = useConvexQuery(api.contact.getSettings, {})

const {
  mutate: submitContact,
  isPending
} = useConvexMutation(api.contact.submit)

const displayError = computed(() => submitError.value)
const contactSettings = computed(() => savedContactSettings.value ?? emptyContactSettings)

function phoneHref(phone: string) {
  const normalized = phone.replace(/(?!^\+)\D/g, '')
  return `tel:${normalized}`
}

function resetContactForm() {
  contactForm.name = ''
  contactForm.email = ''
  contactForm.phone = ''
  contactForm.subject = ''
  contactForm.message = ''
}

async function submitContactForm() {
  submitSuccess.value = ''
  submitError.value = ''

  const email = contactForm.email.trim()
  const phone = contactForm.phone.trim()

  if (!email && !phone) {
    submitError.value = 'Please enter an email address or phone number.'
    return
  }

  try {
    await submitContact({
      name: contactForm.name,
      email,
      phone,
      subject: contactForm.subject,
      message: contactForm.message
    })

    resetContactForm()
    submitSuccess.value = 'Your message has been submitted successfully.'
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Unable to submit your message.'
  }
}
</script>
