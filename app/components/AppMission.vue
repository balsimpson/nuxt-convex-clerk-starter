<template>
  <section class="relative overflow-hidden px-4 pb-[4.5rem] pt-0 sm:px-6 lg:px-8 lg:pb-24">
    <div class="mx-auto max-w-7xl">
      <Motion
        as="p"
        class="mb-5 text-xs font-semibold uppercase text-[#7a4f36]"
        :initial="revealInitial"
        :while-in-view="revealVisible"
        :in-view-options="viewOnce"
        :transition="revealTransition()"
      >
        Our Mission
      </Motion>

      <div class="grid gap-10 border-y border-[#d9c9b7] py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16 lg:py-14">
        <div class="max-w-2xl">
          <Motion
            as="h2"
            class="font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl lg:text-6xl"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.08)"
          >
            To empower marginalized communities
          </Motion>

          <Motion
            as="p"
            class="mt-6 text-base leading-8 text-[#665646] sm:text-lg"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.16)"
          >
            Particularly <span class="font-semibold text-[#3a2718]">dalits, tribals, women, children, and minorities</span> by enabling them to protect and assert their rights, live with dignity, and participate actively in democratic and developmental processes.
          </Motion>

          <Motion
            as="div"
            class="mt-9 border-l border-[#8a6a52] pl-5"
            :initial="revealInitial"
            :while-in-view="revealVisible"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.24)"
          >
            <p class="text-xs font-semibold uppercase text-[#7a4f36]">
              Mission Statement
            </p>
            <p class="mt-3 font-serif text-2xl leading-9 text-[#3a2718] sm:text-3xl">
              Rights protection, dignity, and participation are treated as one continuous public practice.
            </p>
          </Motion>
        </div>

        <div>
          <Motion
            as="div"
            class="flex items-end justify-between gap-4 border-b border-[#d9c9b7] pb-4"
            :initial="{ opacity: 0, y: 16 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="viewOnce"
            :transition="revealTransition(0.2)"
          >
            <div>
              <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                Key Focus Areas
              </p>
              <p class="mt-2 max-w-xl text-sm leading-6 text-[#665646]">
                A practical ecosystem of legal access, education, and livelihoods.
              </p>
            </div>
            <div class="hidden text-xs font-semibold uppercase text-[#8b6244] sm:block">
              8 programs
            </div>
          </Motion>

          <div class="grid sm:grid-cols-2 sm:border-l sm:border-[#d9c9b7]">
            <Motion
              v-for="(item, index) in focusAreas"
              :key="item.title"
              as="div"
              class="border-b border-[#d9c9b7] py-5 last:border-b-0 sm:px-5 sm:[&:nth-last-child(-n+2)]:border-b-0"
              :initial="{ opacity: 0, y: 14 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.2 + index * 0.045)"
            >
              <div class="flex items-start gap-3">
                <span class="mt-0.5 w-8 shrink-0 font-serif text-2xl leading-none text-[#a47553]">{{ index + 1 }}</span>
                <div>
                  <h3 class="text-sm font-semibold leading-6 text-[#2f2118] sm:text-base">
                    {{ item.title }}
                  </h3>
                  <p class="mt-1 text-sm leading-6 text-[#665646]">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </Motion>
          </div>
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

const focusAreas = [
  {
    title: 'Free Tele-Helpline',
    description: 'Accessible support for immediate legal guidance and referral.'
  },
  {
    title: 'Legal Outreach',
    description: 'Community-facing legal assistance that reaches people where they are.'
  },
  {
    title: 'Mobile Legal Clinics',
    description: 'On-site legal services delivered directly to underserved communities.'
  },
  {
    title: 'Training & Workshops',
    description: 'Capacity-building sessions that strengthen rights awareness and agency.'
  },
  {
    title: 'Constitutional Rights Education in Schools',
    description: 'Early civic learning that builds democratic understanding and confidence.'
  },
  {
    title: 'District Resource Centres',
    description: 'Local hubs for coordinated support, information, and access.'
  },
  {
    title: 'Economic Empowerment & Livelihood Training',
    description: 'Programs that connect rights with income, skill-building, and resilience.'
  },
  {
    title: 'Internships, Campaigns, & Volunteering',
    description: 'Paths for participation, solidarity, and movement-building.'
  }
]
</script>
