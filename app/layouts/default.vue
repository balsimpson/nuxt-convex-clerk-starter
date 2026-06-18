<template>
  <div class="min-h-screen bg-[#f7efe2] text-[#2f2118]">
    <header class="sticky top-0 z-50 border-b border-[#d9c9b7]/80 bg-[#f7efe2]/92 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NuxtLink
          to="/"
          class="flex items-center gap-4 self-start"
          aria-label="Manasa home"
        >
          <div class="flex h-[3.25rem] w-[3.25rem] items-center justify-center overflow-hidden">
            <img
              src="/manasa-logo-copy.png"
              alt="Manasa logo"
              class="h-full w-full object-contain"
            >
          </div>

          <div class="min-w-0 leading-tight">
            <p class="font-serif text-xl leading-none text-[#2f2118]">
              Manasa
            </p>
            <p class="mt-1 max-w-[14rem] text-xs leading-5 text-[#756453] sm:max-w-none sm:text-sm">
              Center for Development and Social Action
            </p>
          </div>
        </NuxtLink>

        <nav
          class="flex flex-wrap items-center gap-1.5"
          aria-label="Primary"
        >
          <UButton
            to="/blog"
            variant="ghost"
            color="neutral"
            class="rounded-none px-3 py-2 text-sm font-medium text-[#4e3a2b] hover:bg-[#efe2d0]"
          >
            Blog
          </UButton>

          <UButton
            to="/about-us"
            variant="ghost"
            color="neutral"
            class="rounded-none px-3 py-2 text-sm font-medium text-[#4e3a2b] hover:bg-[#efe2d0]"
          >
            About Us
          </UButton>

          <UButton
            to="/contact-us"
            color="neutral"
            variant="solid"
            trailing-icon="i-lucide-arrow-up-right"
            class="rounded-none border border-[#2f2118] bg-[#2f2118] px-4 py-2 text-sm font-medium text-[#f7efe2] hover:bg-[#4b3324]"
          >
            Contact Us
          </UButton>
        </nav>
      </div>
    </header>

    <slot />
  </div>
</template>
