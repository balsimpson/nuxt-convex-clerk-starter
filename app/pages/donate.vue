<template>
  <div class="min-h-screen bg-[#fbf7ef] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-[4.5rem]">
      <div class="absolute inset-x-0 top-0 -z-10 h-full bg-[#fbf7ef]" />
      <div class="absolute left-[-6rem] top-10 -z-10 h-72 w-72 rounded-full bg-[#ead6bf]/75 blur-3xl" />
      <div class="absolute right-[-7rem] top-24 -z-10 h-96 w-96 rounded-full bg-[#e8d7c3]/70 blur-3xl" />

      <div class="mx-auto max-w-7xl">
        <UBreadcrumb
          :items="breadcrumbItems"
          separator-icon="i-lucide-chevron-right"
          class="mb-8 text-[#4f4134]"
        />

        <section class="border-b border-[#d9c9b7] pb-12 lg:pb-16">
          <div class="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:gap-16">
            <div class="max-w-3xl">
              <Motion
                as="p"
                class="mb-5 text-xs font-semibold uppercase text-[#5f3724]"
                :initial="textInitial"
                :animate="textVisible"
                :transition="heroTransition(0.04)"
              >
                Support Us
              </Motion>

              <Motion
                as="h1"
                class="max-w-4xl font-serif text-[clamp(2.75rem,5vw,4.75rem)] font-normal leading-[1.04] text-[#2f2118] text-balance sm:text-[clamp(3rem,4.2vw,5rem)] lg:text-[clamp(3.25rem,3.6vw,5.25rem)]"
                :initial="textInitial"
                :animate="textVisible"
                :transition="heroTransition(0.16)"
              >
                Help sustain our work for a
                <span class="font-bold">just and humane</span>
                society.
              </Motion>

              <Motion
                as="p"
                class="mt-7 max-w-2xl text-base leading-8 text-[#4f4134] sm:text-lg"
                :initial="textInitial"
                :animate="textVisible"
                :transition="heroTransition(0.28)"
              >
                Your donation helps us continue our grassroots work in human rights, community development, and social action.
              </Motion>

              <Motion
                as="p"
                class="mt-6 max-w-2xl text-base leading-8 text-[#4f4134] sm:text-lg"
                :initial="textInitial"
                :animate="textVisible"
                :transition="heroTransition(0.4)"
              >
                You can contribute directly through bank transfer using the details shown on the right. Donations are eligible for an 80G tax exemption receipt.
              </Motion>
            </div>

            <Motion
              as="figure"
              class="overflow-hidden rounded-lg bg-[#e9d8c5] shadow-lg"
              :initial="panelInitial"
              :animate="panelVisible"
              :transition="{ duration: 0.9, delay: 0.18, ease: motionEase }"
            >
              <div class="flex h-full min-h-[24rem] flex-col justify-between p-6 sm:p-7">
                <div class="flex items-start justify-between gap-4 border-b border-[#8f6240]/25 pb-4">
                  <div>
                    <p class="text-xs font-semibold uppercase text-[#5f3724]">
                      Bank Transfer
                    </p>
                    <p class="mt-2 max-w-sm text-sm leading-6 text-[#4f4134]">
                      Use these details for a direct donation to Manasa.
                    </p>
                  </div>

                  <div class="rounded-full border border-[#8a6a52] bg-[#f8efe4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f3724]">
                    80G Eligible
                  </div>
                </div>

                <dl class="mt-5 divide-y divide-[#dfd1c2]">
                  <div
                    v-for="item in bankDetails"
                    :key="item.label"
                    class="grid gap-2 py-4 sm:grid-cols-[0.85fr_1.15fr] sm:gap-6"
                  >
                    <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f3724]">
                      {{ item.label }}
                    </dt>
                    <dd class="text-sm leading-7 text-[#3a2718] sm:text-base">
                      {{ item.value }}
                    </dd>
                  </div>
                </dl>
              </div>
            </Motion>
          </div>
        </section>

        <section class="pt-10 md:pt-14">
          <div class="grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:gap-14">
            <Motion
              as="div"
              class="max-w-sm"
              :initial="scrollInitial"
              :while-in-view="scrollVisible"
              :in-view-options="viewOnce"
              :transition="heroTransition(0)"
            >
              <p class="text-xs font-semibold uppercase text-[#5f3724]">
                Why Give
              </p>
              <p class="mt-4 font-serif text-3xl leading-tight text-[#2f2118] sm:text-4xl">
                Donations directly support rights-based work in communities.
              </p>
            </Motion>

            <div class="space-y-6 text-base leading-8 text-[#4f4134] sm:text-lg">
              <Motion
                as="p"
                :initial="scrollInitial"
                :while-in-view="scrollVisible"
                :in-view-options="viewOnce"
                :transition="heroTransition(0.08)"
              >
                Contributions help us organize community programs, advocacy efforts, education initiatives, and monitoring work across Karnataka and neighboring states.
              </Motion>

              <Motion
                as="p"
                :initial="scrollInitial"
                :while-in-view="scrollVisible"
                :in-view-options="viewOnce"
                :transition="heroTransition(0.16)"
              >
                If you want to share the reference details with your finance team or request clarification, the account information above is the complete set of transfer details we use for donations.
              </Motion>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const textInitial = { opacity: 0, y: 24 }
const textVisible = { opacity: 1, y: 0 }
const panelInitial = { opacity: 0, y: 22, scale: 0.97 }
const panelVisible = { opacity: 1, y: 0, scale: 1 }
const scrollInitial = { opacity: 0, y: 30 }
const scrollVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.3, margin: '0px 0px -90px 0px' } as const

function heroTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}

const breadcrumbItems = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Donate'
  }
] satisfies BreadcrumbItem[]

const bankDetails = [
  {
    label: 'Bank Name',
    value: 'South Indian Bank'
  },
  {
    label: 'Branch',
    value: 'M.S Nagar'
  },
  {
    label: 'Account Holder Name',
    value: 'MANASA Center for development and social action'
  },
  {
    label: 'Account Number',
    value: '0231053000005006'
  },
  {
    label: 'IFSC Code',
    value: 'SIBL0000231'
  }
] as const
</script>
