<template>
  <section class="relative overflow-hidden px-4 pb-20 pt-0 sm:px-6 lg:px-8 lg:pb-28">
    <div class="mx-auto max-w-7xl">
      <Motion
        as="p"
        class="mb-5 text-xs font-semibold uppercase text-[#7a4f36]"
        :initial="revealInitial"
        :while-in-view="revealVisible"
        :in-view-options="viewOnce"
        :transition="revealTransition()"
      >
        Get Involved
      </Motion>

      <div class="grid gap-10 border-b border-[#d9c9b7] pb-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16 lg:pb-16">
        <Motion
          as="figure"
          class="relative border border-[#d0bda8] bg-[#efe2d0] p-2"
          :initial="{ opacity: 0, y: 30, scale: 0.985 }"
          :while-in-view="{ opacity: 1, y: 0, scale: 1 }"
          :in-view-options="viewOnce"
          :transition="revealTransition(0.08)"
        >
          <img
            class="h-full min-h-[24rem] w-full object-cover object-center"
            src="/hero.jpeg"
            alt="Volunteers and community members working together"
          >

          <figcaption class="absolute inset-x-2 bottom-2 bg-[#2f2118]/86 px-5 py-5 text-[#f7efe2] backdrop-blur-sm">
            <p class="text-xs font-semibold uppercase text-[#e8d2bc]">
              Collective action
            </p>
            <p class="mt-2 max-w-md font-serif text-2xl leading-8 sm:text-3xl">
              Time, partnerships, and donations all help expand rights, dignity, and access.
            </p>
          </figcaption>
        </Motion>

        <div class="max-w-3xl">
          <Motion
            as="h2"
            class="font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl lg:text-6xl"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.16)"
          >
            Join the work in a way that fits your skills.
          </Motion>

          <Motion
            as="p"
            class="mt-6 text-base leading-8 text-[#665646] sm:text-lg"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.24)"
          >
            Support Manasa through volunteering, institutional partnerships, internships, or donations. Every path helps extend community-led legal access, education, and livelihood support.
          </Motion>

          <div class="mt-10 space-y-0 border-y border-[#d9c9b7]">
            <Motion
              v-for="(item, index) in involvementOptions"
              :key="item.title"
              as="div"
              class="grid gap-3 border-b border-[#d9c9b7] py-5 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-6"
              :initial="{ opacity: 0, x: 18 }"
              :while-in-view="{ opacity: 1, x: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.22 + index * 0.07)"
            >
              <h3 class="text-base font-semibold text-[#2f2118] sm:text-lg">
                {{ item.title }}
              </h3>
              <p class="max-w-2xl text-sm leading-7 text-[#665646] sm:text-base">
                {{ item.description }}
              </p>
            </Motion>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <Motion
              as="div"
              class="min-w-0 flex-1"
              :initial="{ opacity: 0, y: 18 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.36)"
            >
              <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                Donate with transparency
              </p>
              <p class="mt-2 text-sm leading-7 text-[#4f4134] sm:text-base">
                Support our programs with transparency and tax benefits under Section 80G.
              </p>
            </Motion>

            <Motion
              as="div"
              :initial="{ opacity: 0, y: 14 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.44)"
            >
              <UButton
                to="/donate"
                color="neutral"
                variant="solid"
                trailing-icon="i-lucide-arrow-up-right"
                class="rounded-none border border-[#2f2118] bg-[#2f2118] px-5 py-3 text-sm font-medium text-[#f7efe2] hover:bg-[#4b3324]"
              >
                Donate
              </UButton>
            </Motion>

            <Motion
              as="div"
              :initial="{ opacity: 0, y: 14 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.5)"
            >
              <UButton
                type="button"
                color="neutral"
                variant="outline"
                icon="i-lucide-hand-heart"
                class="rounded-none border-[#8a6a52] px-5 py-3 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
                @click="emit('openVolunteerModal')"
              >
                Get Involved
              </UButton>
            </Motion>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'openVolunteerModal'): void
}>()

const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const revealInitial = { opacity: 0, y: 28 }
const revealVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.24, margin: '0px 0px -90px 0px' } as const

function revealTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}

const involvementOptions = [
  {
    title: 'Volunteer With Us',
    description: 'Share your time and skills in community outreach, support work, campaigns, and learning programs.'
  },
  {
    title: 'Partner With Us',
    description: 'Collaborate as an NGO, academic institution, or corporate partner to deepen reach and impact.'
  },
  {
    title: 'Intern With Us',
    description: 'Gain practical learning experience while contributing to live social action and field initiatives.'
  }
]
</script>
