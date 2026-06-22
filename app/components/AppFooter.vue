<template>
  <footer class="border-t border-[#d9c9b7] bg-[#f7efe2] text-[#2f2118]">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div class="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_1fr] lg:gap-14">
        <div class="max-w-xl">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-4"
            aria-label="Manasa home"
          >
            <span class="flex h-14 w-14 items-center justify-center overflow-hidden">
              <img
                src="/manasa-logo-copy.png"
                alt="Manasa logo"
                class="h-full w-full object-contain"
              >
            </span>

            <span class="leading-tight">
              <span class="block font-serif text-2xl text-[#2f2118]">
                Manasa
              </span>
              <span class="mt-1 block text-sm leading-5 text-[#4f4134]">
                Center for Development and Social Action
              </span>
            </span>
          </NuxtLink>

          <p class="mt-6 max-w-lg text-sm leading-7 text-[#4f4134] sm:text-base">
            We work towards empowering marginalized communities and protecting their rights through education, advocacy, and campaigning.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <UButton
              to="/donate"
              color="neutral"
              variant="solid"
              trailing-icon="i-lucide-hand-heart"
              class="rounded-none border border-[#2f2118] bg-[#2f2118] px-4 py-2.5 text-sm font-medium text-[#fbf7ef] hover:bg-[#4b3324]"
            >
              Donate
            </UButton>

            <UButton
              to="/contact-us"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-arrow-up-right"
              class="rounded-none border-[#8a6a52] px-4 py-2.5 text-sm font-medium text-[#3a2718] hover:bg-[#efe2d0]"
            >
              Contact Us
            </UButton>
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <p class="text-xs font-semibold uppercase text-[#5f3724]">
            Explore
          </p>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-[#4f4134]">
            <li
              v-for="link in navigationLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="transition hover:text-[#8f6240]"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <p class="text-xs font-semibold uppercase text-[#5f3724]">
            Bangalore Office
          </p>

          <address class="mt-4 not-italic text-sm leading-7 text-[#4f4134]">
            1/F, 35 Anjanappa Complex Hennur Main Road,<br>
            Lingarajapuram<br>
            Bangalore 560 084<br>
            India
          </address>

          <div class="mt-5 space-y-3 text-sm leading-6 text-[#4f4134]">
            <a
              href="tel:+918025473922"
              class="flex items-center gap-3 transition hover:text-[#8f6240]"
            >
              <UIcon
                name="i-lucide-phone"
                class="h-4 w-4 shrink-0 text-[#5f3724]"
              />
              +91-80-25473922
            </a>
            <a
              href="mailto:contact@sichrem.org"
              class="flex items-center gap-3 transition hover:text-[#8f6240]"
            >
              <UIcon
                name="i-lucide-mail"
                class="h-4 w-4 shrink-0 text-[#5f3724]"
              />
              contact@sichrem.org
            </a>
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-col gap-3 border-t border-[#d9c9b7] pt-5 text-xs leading-6 text-[#6f5a48] sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {{ currentYear }} Manasa. All rights reserved.
        </p>
        <p>
          Monday - Friday: 10.00am to 5.00pm
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const navigationLinks = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Blog',
    to: '/blog'
  },
  {
    label: 'About Us',
    to: '/about-us'
  },
  {
    label: 'Donate',
    to: '/donate'
  },
  {
    label: 'Contact Us',
    to: '/contact-us'
  }
] as const
</script>
