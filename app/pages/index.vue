<template>
  <div class="min-h-screen bg-[#f7efe2] text-[#2f2118]">
    <main class="relative overflow-hidden">
      <AppHero @open-volunteer-modal="volunteerOpen = true" />
      <AppMission />
      <AppImpact />
      <AppGetInvolved @open-volunteer-modal="volunteerOpen = true" />
      <AppBlog />
    </main>

    <UModal
      v-model:open="volunteerOpen"
      :ui="{
        content: 'bg-[#f7efe2] text-[#2f2118] ring-1 ring-[#d0bda8]',
        header: 'border-b border-[#d9c9b7] bg-[#f7efe2] px-6 py-5 sm:px-8',
        body: 'bg-[#f7efe2] px-6 py-6 sm:px-8',
        footer: 'border-t border-[#d9c9b7] bg-[#f7efe2] px-6 py-5 sm:px-8'
      }"
    >
      <template #header>
        <div class="flex items-start gap-4">
          <div class="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-[#d0bda8] text-[#7a4f36]">
            <UIcon
              name="i-lucide-hand-heart"
              class="h-5 w-5"
            />
          </div>

          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase text-[#7a4f36]">
              Volunteer interest
            </p>
            <h2 class="mt-1 font-serif text-2xl leading-tight text-[#2f2118] sm:text-3xl">
              Join the work in a way that fits you.
            </h2>
            <p class="mt-2 max-w-xl text-sm leading-6 text-[#6e5b4b]">
              Share a few details and we'll follow up about volunteering, partnerships, or internships.
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <form
          id="volunteer-interest-form"
          class="space-y-4"
          @submit.prevent="submitVolunteerInterest"
        >
          <UFormField
            label="Full name"
            required
            class="w-full"
          >
            <UInput
              v-model="volunteerForm.name"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Email address"
            required
            class="w-full"
          >
            <UInput
              v-model="volunteerForm.email"
              type="email"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Phone number"
            class="w-full"
          >
            <UInput
              v-model="volunteerForm.phone"
              type="tel"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="How you'd like to help"
            required
            class="w-full"
          >
            <USelect
              v-model="volunteerForm.interest"
              required
              class="w-full"
              :items="helpOptions"
            />
          </UFormField>

          <UFormField
            label="Availability / notes"
            class="w-full"
          >
            <UTextarea
              v-model="volunteerForm.message"
              :rows="4"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            class="rounded-none border-[#8a6a52] px-5 py-3 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
            @click="closeVolunteerModal(close)"
          >
            Close
          </UButton>

          <UButton
            type="submit"
            form="volunteer-interest-form"
            color="neutral"
            variant="solid"
            trailing-icon="i-lucide-send"
            class="rounded-none border border-[#2f2118] bg-[#2f2118] px-5 py-3 text-sm font-medium text-[#f7efe2] hover:bg-[#4b3324]"
          >
            Submit
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const volunteerOpen = ref(false)

const volunteerForm = reactive({
  name: '',
  email: '',
  phone: '',
  interest: 'Volunteering',
  message: ''
})

const helpOptions = ['Volunteering', 'Internship', 'Partnership', 'Donation']

function resetVolunteerForm() {
  volunteerForm.name = ''
  volunteerForm.email = ''
  volunteerForm.phone = ''
  volunteerForm.interest = 'Volunteering'
  volunteerForm.message = ''
}

watch(volunteerOpen, (isOpen) => {
  if (!isOpen) {
    resetVolunteerForm()
  }
})

function closeVolunteerModal(close: () => void) {
  close()
}

function submitVolunteerInterest() {
  volunteerOpen.value = false
}
</script>
