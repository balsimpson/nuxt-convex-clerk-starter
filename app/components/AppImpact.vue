<template>
  <section class="relative overflow-hidden px-4 pb-[4.5rem] pt-0 sm:px-6 lg:px-8 lg:pb-24">
    <div class="mx-auto max-w-7xl">
      <Motion
        as="p"
        class="mb-5 text-xs font-semibold uppercase text-[#5f3724]"
        :initial="revealInitial"
        :while-in-view="revealVisible"
        :in-view-options="viewOnce"
        :transition="revealTransition()"
      >
        Our Impact
      </Motion>

      <div class="grid gap-10 border-b border-[#d9c9b7] pb-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16 lg:pb-16">
        <div class="max-w-2xl">
          <Motion
            as="h2"
            class="font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl lg:text-6xl"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.08)"
          >
            Numbers shaped by access, learning, and <span class="font-bold">collective action</span>.
          </Motion>

          <Motion
            as="p"
            class="mt-6 text-base leading-8 text-[#4f4134] sm:text-lg"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.16)"
          >
            The impact story spans schools, livelihoods, helplines, workshops, and legal outreach across districts.
          </Motion>
        </div>

        <div class="grid border-t border-[#d9c9b7] sm:grid-cols-2 sm:border-l lg:border-t-0">
          <Motion
            v-for="(stat, index) in impactStats"
            :key="stat.label"
            as="article"
            class="grid grid-cols-[7.5rem_1fr] items-start gap-4 border-b border-[#d9c9b7] py-5 last:border-b-0 sm:block sm:px-5 sm:odd:border-r lg:py-6"
            :initial="{ opacity: 0, y: 22 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.12 + index * 0.055)"
          >
            <p class="whitespace-nowrap font-serif text-3xl leading-none text-[#2f2118] sm:text-4xl">
              {{ stat.value }}
            </p>
            <h3 class="max-w-[20ch] text-sm font-medium leading-6 text-[#46382c] sm:mt-3 sm:text-base">
              {{ stat.label }}
            </h3>
          </Motion>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const revealInitial = { opacity: 0, y: 28 }
const revealVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.24, margin: '0px 0px -90px 0px' } as const

function revealTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}

const impactStats = [
  {
    value: '3 Lakh+',
    label: 'Students reached through CRE'
  },
  {
    value: '15,000+',
    label: 'Students completed internships'
  },
  {
    value: '100+',
    label: 'Women trained in livelihood skills'
  },
  {
    value: '9',
    label: 'District Resource Centres'
  },
  {
    value: '2 Lakh+',
    label: 'Calls received on helpline'
  },
  {
    value: '1,000+',
    label: 'Workshops conducted'
  },
  {
    value: '3 Lakh+',
    label: 'People reached through Legal Outreach'
  }
]
</script>
