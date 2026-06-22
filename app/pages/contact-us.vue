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
                  required
                  class="w-full sm:col-span-1"
                >
                  <UInput
                    v-model="contactForm.email"
                    type="email"
                    required
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
                <div>
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Address
                  </p>
                  <p class="mt-3 text-sm leading-7 text-[#4f4134]">
                    1/F, 35 Anjanappa Complex Hennur Main Road,
                    <br>
                    Lingarajapuram
                    <br>
                    Bangalore 560 084
                    <br>
                    India
                  </p>
                </div>

                <div class="border-t border-[#d9c9b7] pt-6">
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Phone
                  </p>
                  <div class="mt-3 space-y-2 text-sm leading-7 text-[#4f4134]">
                    <a
                      href="tel:+918025473922"
                      class="block transition hover:text-[#8f6240]"
                    >
                      +91-80-25473922
                    </a>
                    <a
                      href="tel:+918025492856"
                      class="block transition hover:text-[#8f6240]"
                    >
                      +91-80-25492856
                    </a>
                  </div>
                </div>

                <div class="border-t border-[#d9c9b7] pt-6">
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Email
                  </p>
                  <div class="mt-3 space-y-2 text-sm leading-7 text-[#4f4134]">
                    <a
                      href="mailto:contact@sichrem.org"
                      class="block transition hover:text-[#8f6240]"
                    >
                      contact@sichrem.org
                    </a>
                    <a
                      href="mailto:msichrem@gmail.com"
                      class="block transition hover:text-[#8f6240]"
                    >
                      msichrem@gmail.com
                    </a>
                  </div>
                </div>

                <div class="border-t border-[#d9c9b7] pt-6">
                  <p class="text-xs font-semibold uppercase text-[#5f3724]">
                    Office Hours
                  </p>
                  <div class="mt-3 space-y-3 text-sm leading-7 text-[#4f4134]">
                    <p>
                      Monday - Friday: 10.00am to 5.00pm
                    </p>
                    <p>
                      Staff on Field Work - Office will be closed on Saturday
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
import { useConvexMutation } from 'convex-vue'

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

const {
  mutate: submitContact,
  isPending
} = useConvexMutation(api.contact.submit)

const displayError = computed(() => submitError.value)

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

  try {
    await submitContact({
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
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
