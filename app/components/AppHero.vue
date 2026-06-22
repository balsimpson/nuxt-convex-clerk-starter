<script setup lang="ts">
const emit = defineEmits<{
  (event: 'openVolunteerModal'): void
}>()

const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const heroTextInitial = { opacity: 0, y: 24 }
const heroTextVisible = { opacity: 1, y: 0 }
const mediaInitial = { opacity: 0, y: 22, scale: 0.97 }
const mediaVisible = { opacity: 1, y: 0, scale: 1 }
const scrollInitial = { opacity: 0, y: 30 }
const scrollVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.3, margin: '0px 0px -90px 0px' } as const

function heroTextTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}
</script>

<template>
  <section class="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-[4.5rem]">
    <div class="mx-auto max-w-7xl">
      <div class="grid gap-10 border-b border-[#d9c9b7] pb-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:gap-16 lg:pb-16">
        <div class="max-w-3xl">
          <Motion
            as="p"
            class="mb-5 text-xs font-semibold uppercase text-[#5f3724]"
            :initial="heroTextInitial"
            :animate="heroTextVisible"
            :transition="heroTextTransition(0.04)"
          >
            Manasa Centre for Development and Social Action
          </Motion>

          <Motion
            as="h1"
            class="max-w-4xl text-left font-serif text-5xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
            :initial="heroTextInitial"
            :animate="heroTextVisible"
            :transition="heroTextTransition(0.16)"
          >
            Towards a just and <span class="font-bold">humane</span> society
          </Motion>

          <Motion
            as="p"
            class="mt-7 max-w-2xl text-base leading-8 text-[#4f4134] sm:text-lg"
            :initial="heroTextInitial"
            :animate="heroTextVisible"
            :transition="heroTextTransition(0.28)"
          >
            Manasa Centre for Development and Social Action is a grassroots nonprofit headquartered in Bangalore, Karnataka. Founded in 1995 by the late visionary <span class="font-semibold text-[#2f2118]">Shri Mathews Philip</span>, Manasa has grown into a deeply rooted civil society organization.
          </Motion>

          <Motion
            as="div"
            class="mt-9 flex flex-wrap items-center gap-3"
            :initial="heroTextInitial"
            :animate="heroTextVisible"
            :transition="heroTextTransition(0.4)"
          >
            <UButton
              to="/donate"
              color="neutral"
              variant="solid"
              trailing-icon="i-lucide-arrow-up-right"
              class="rounded-none border border-[#2f2118] bg-[#2f2118] px-6 py-3 text-sm font-medium text-[#fbf7ef] hover:bg-[#4b3324]"
            >
              Donate
            </UButton>

            <UButton
              type="button"
              color="neutral"
              variant="outline"
              icon="i-lucide-hand-heart"
              class="rounded-none border-[#8a6a52] px-6 py-3 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
              @click="emit('openVolunteerModal')"
            >
              Volunteer
            </UButton>
          </Motion>
        </div>

        <Motion
          as="figure"
          class="relative overflow-hidden rounded-lg bg-[#e9d8c5] shadow-lg"
          :initial="mediaInitial"
          :animate="mediaVisible"
          :transition="{ duration: 0.9, delay: 0.18, ease: motionEase }"
        >
          <img
            class="aspect-[5/4] w-full object-cover object-center lg:aspect-[4/5]"
            src="/hero.jpeg"
            alt="Community members gathered for Manasa's work"
          >
        </Motion>
      </div>

      <div class="pt-10 md:pt-14">
        <div class="grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:gap-14">
          <Motion
            as="div"
            class="max-w-sm"
            :initial="scrollInitial"
            :while-in-view="scrollVisible"
            :in-view-options="viewOnce"
            :transition="heroTextTransition(0)"
          >
            <p class="text-xs font-semibold uppercase text-[#5f3724]">
              About Manasa
            </p>
            <p class="mt-4 font-serif text-3xl leading-tight text-[#2f2118] sm:text-4xl">
              Justice, humanity, and society held together in practice.
            </p>
          </Motion>

          <div class="space-y-6 text-base leading-8 text-[#4f4134] sm:text-lg">
            <Motion
              as="p"
              :initial="scrollInitial"
              :while-in-view="scrollVisible"
              :in-view-options="viewOnce"
              :transition="heroTextTransition(0.08)"
            >
              The name Manasa reflects its core values: <span class="font-semibold text-[#2f2118]">Ma - Manaviya Mathu</span> (Humanity), <span class="font-semibold text-[#2f2118]">Na - Nyayayukta</span> (Justice), and <span class="font-semibold text-[#2f2118]">Sa - Samajakagi</span> (For Society).
            </Motion>

            <Motion
              as="p"
              :initial="scrollInitial"
              :while-in-view="scrollVisible"
              :in-view-options="viewOnce"
              :transition="heroTextTransition(0.16)"
            >
              Guided by dignity, empowerment, and participatory development, Manasa works with women, children, and marginalized communities across Karnataka and neighboring states.
            </Motion>

            <Motion
              as="p"
              :initial="scrollInitial"
              :while-in-view="scrollVisible"
              :in-view-options="viewOnce"
              :transition="heroTextTransition(0.24)"
            >
              Today, Manasa operates in <span class="font-semibold text-[#2f2118]">ten districts</span>, implementing preventive, promotive, and rights-restorative interventions through community engagement, advocacy, education, and monitoring.
            </Motion>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
