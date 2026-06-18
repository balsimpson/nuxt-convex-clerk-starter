<template>
  <div class="min-h-screen bg-[#f5efe6] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="absolute inset-x-0 top-0 -z-10 h-full bg-[#f5efe6]" />
      <div class="absolute left-[-6rem] top-10 -z-10 h-72 w-72 rounded-full bg-[#ead6bf]/75 blur-3xl" />
      <div class="absolute right-[-7rem] top-24 -z-10 h-96 w-96 rounded-full bg-[#e8d7c3]/70 blur-3xl" />

      <div class="mx-auto max-w-7xl">
        <UBreadcrumb
          :items="breadcrumbItems"
          separator-icon="i-lucide-chevron-right"
          class="mb-8 text-[#6e5b4b]"
        />

        <section class="border-y border-[#d8c8b8] py-10 sm:py-12 lg:py-14">
          <div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div class="max-w-2xl">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b5a3d]">
                Support Us
              </p>

              <h1 class="mt-4 text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[#2f2118] sm:text-6xl lg:text-7xl xl:text-[5.6rem]">
                Support our cause and
                <span class="inline-block rounded-[8px] bg-[#dcc0a3] px-3 pb-1 text-[#2f2118] underline decoration-[#8f6240] decoration-2 underline-offset-8">
                  make a difference!
                </span>
              </h1>

              <p class="mt-6 max-w-xl text-base leading-8 text-[#6e5b4b] sm:text-lg">
                Your donation can help us continue our work towards promoting and protecting human rights.
              </p>

              <p class="mt-6 max-w-xl text-base leading-8 text-[#6e5b4b] sm:text-lg">
                You can make a direct bank transfer to our account with the following details:
              </p>

              <p class="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#7b5a3d]">
                Make a contribution to our cause and receive an 80G tax exemption receipt
              </p>
            </div>

            <div class="rounded-[34px] border border-[#d6c3ae] bg-[#fffaf3] p-5 shadow-[0_24px_60px_rgba(47,33,24,0.08)] sm:p-6 lg:p-7">
              <div class="flex items-center justify-between gap-4 border-b border-[#dfd1c2] pb-4">
                <div>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b5a3d]">
                    Bank Transfer
                  </p>
                  <p class="mt-2 text-sm leading-6 text-[#6e5b4b]">
                    Use the account details below for a direct donation.
                  </p>
                </div>
                <div class="hidden rounded-full border border-[#d6c3ae] bg-[#f8efe4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b5a3d] sm:block">
                  80G Eligible
                </div>
              </div>

              <dl class="mt-5 space-y-0 divide-y divide-[#dfd1c2]">
                <div
                  v-for="item in bankDetails"
                  :key="item.label"
                  class="grid gap-2 py-4 sm:grid-cols-[0.85fr_1.15fr] sm:gap-6"
                >
                  <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5a3d]">
                    {{ item.label }}
                  </dt>
                  <dd class="text-sm leading-7 text-[#3a2718] sm:text-base">
                    {{ item.value }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

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
