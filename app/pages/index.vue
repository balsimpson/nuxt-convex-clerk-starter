<script setup lang="ts">
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import { useConvexQuery } from 'convex-vue'
import { buildYouTubeThumbnailUrl, extractYouTubeVideoId } from '~/lib/youtube'

const trustSignals = [
  '350+ Films Produced',
  'Since 2010',
  'India & Dubai',
  'Award-Winning TVCs'
]

const clientBrands = [
  'ESAF Bank',
  'Medimix',
  'Amity University',
  'Paragon',
  'Khimji',
  'Navarasa Show Reel'
]

const services = [
  {
    title: 'Ad Films',
    description:
      'We believe that the creation of an advertising film is an intricate combination of good storytelling'
  },
  {
    title: 'Digital Films',
    description:
      'Duration is not a problem. It\'s a digital film. Something we love to hear'
  },
  {
    title: 'Corporate Films',
    description: 'Corporate film production is both an art and a science'
  },
  {
    title: 'Audio Visuals',
    description:
      'In a world full of audio visual marvels, may words matter to you and be full of magic'
  },
  {
    title: '2D and 3D Animation Films',
    description:
      'We go beyond the tangible, the structure and space... we reach deep, to the intent'
  },
  {
    title: 'Music Videos',
    description:
      'One good thing about Music, when it hits you, you feel no pain......'
  }
]

type PortfolioItem = Doc<'portfolio'>

const youtubeThumbnailQualities = [
  'maxresdefault',
  'sddefault',
  'hqdefault',
  'mqdefault',
  'default'
] as const

function isYouTubeThumbnailUrl(url: string) {
  return /(?:i|img)\.ytimg\.com\/vi\//i.test(url)
}

function getYouTubeThumbnailSources(videoId: string) {
  return youtubeThumbnailQualities.map(quality => buildYouTubeThumbnailUrl(videoId, quality))
}

function getPortfolioImage(item: PortfolioItem) {
  if (item.thumbnailUrl && !isYouTubeThumbnailUrl(item.thumbnailUrl)) {
    return item.thumbnailUrl
  }

  const videoId = extractYouTubeVideoId(item.videoUrl)
  return videoId ? getYouTubeThumbnailSources(videoId)[0] : item.thumbnailUrl ?? ''
}

function getPortfolioImageSources(item: PortfolioItem) {
  if (item.thumbnailUrl && !isYouTubeThumbnailUrl(item.thumbnailUrl)) {
    return [item.thumbnailUrl]
  }

  const videoId = extractYouTubeVideoId(item.videoUrl)

  if (videoId) {
    return getYouTubeThumbnailSources(videoId)
  }

  return item.thumbnailUrl ? [item.thumbnailUrl] : []
}

function handleHeroImageError(event: Event, sources: string[]) {
  const img = event.currentTarget as HTMLImageElement | null

  if (!img) return

  const currentIndex = Number(img.dataset.fallbackIndex ?? '0')
  const nextIndex = currentIndex + 1
  const nextSource = sources[nextIndex]

  if (!nextSource) return

  img.dataset.fallbackIndex = String(nextIndex)
  img.src = nextSource
}

function getPortfolioHref(item: PortfolioItem) {
  return item.videoUrl
}

// Featured items for the hero carousel
const { data: featuredItems, isPending: heroLoading } = useConvexQuery(api.portfolio.listFeatured, {
  limit: 6
})

const heroHighlights = computed(() => {
  const items = featuredItems.value ?? []
  return items.map(item => ({
    title: item.title,
    label: item.category ?? (item.client ? `${item.client}` : 'Featured'),
    href: item.videoUrl,
    image: getPortfolioImage(item),
    imageSources: getPortfolioImageSources(item),
    description: item.description ?? ''
  }))
})

// Published portfolio items for the portfolio section
const { data: portfolioItems, isPending: portfolioLoading, error: portfolioError } = useConvexQuery(api.portfolio.list, {
  limit: 6,
  publishedOnly: true
})

const portfolio = computed(() => portfolioItems.value ?? [])

// Team members from Convex
const { data: teamData } = useConvexQuery(api.teamMembers.list, {})

const team = computed(() => (teamData.value ?? []).filter(m => m.active))
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white">
    <main>
      <section class="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_45%),linear-gradient(180deg,#0b0b0b_0%,#050505_100%)]">
        <div class="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16">
          <div class="space-y-6 lg:space-y-8">
            <NuxtLink
              to="/"
              class="inline-flex items-center"
              aria-label="Navarasa home"
            >
              <img
                src="https://www.navarasacreatives.com/images/nava.png"
                alt="Navarasa Creatives"
                class="h-12 w-auto sm:h-14"
              >
            </NuxtLink>

            <div class="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-blue-200/80">
              <span
                v-for="signal in trustSignals"
                :key="signal"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/75"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {{ signal }}
              </span>
            </div>

            <div class="max-w-5xl space-y-5">
              <h1 class="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl lg:leading-[0.95]">
                Stories That Sell. Films That Stay.
              </h1>
              <p class="max-w-4xl text-base leading-7 text-white/68 sm:text-lg lg:text-xl lg:leading-8">
                From TV commercials and brand films to corporate videos and music productions, Navarasa creates work for agencies and brands across India and Dubai.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <UButton
                to="#contact"
                size="xl"
                color="primary"
                icon="i-lucide-message-circle"
                class="shadow-none"
              >
                Get in touch
              </UButton>
            </div>

            <div
              v-if="heroLoading"
              class="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center text-sm text-white/40"
            >
              Loading...
            </div>

            <UCarousel
              v-else-if="heroHighlights.length"
              :items="heroHighlights"
              :autoplay="{ delay: 4500 }"
              arrows
              dots
              loop
              class="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]"
            >
              <template #default="{ item }">
                <a
                  :href="item.href"
                  target="_blank"
                  rel="noreferrer"
                  class="group block w-full"
                  :title="item.title"
                >
                  <div class="relative aspect-[16/9] w-full overflow-hidden bg-black sm:aspect-[21/9]">
                    <img
                      :src="item.image"
                      :alt="item.title"
                      @error="handleHeroImageError($event, item.imageSources)"
                      class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    >
                    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.42)_40%,rgba(0,0,0,0.82)_100%)]" />
                    <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8 lg:p-10">
                      <div class="max-w-3xl space-y-3">
                        <p class="text-xs uppercase tracking-[0.32em] text-blue-200/85">
                          {{ item.label }}
                        </p>
                        <h2 class="text-2xl font-medium tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
                          {{ item.title }}
                        </h2>
                        <p class="max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                          {{ item.description }}
                        </p>
                      </div>
                      <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-transform duration-200 group-hover:scale-105 sm:h-16 sm:w-16">
                        <UIcon name="i-lucide-play" class="text-2xl" />
                      </div>
                    </div>
                  </div>
                </a>
              </template>
            </UCarousel>

            <div class="border-t border-white/10 pt-6 lg:pt-8">
              <p class="text-xs uppercase tracking-[0.3em] text-white/40">
                Client / brand logo strip
              </p>
              <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-white/70 sm:text-base">
                <span
                  v-for="(brand, index) in clientBrands"
                  :key="brand"
                  class="inline-flex items-center gap-4"
                >
                  <span class="font-medium text-white/80">
                    {{ brand }}
                  </span>
                  <span
                    v-if="index < clientBrands.length - 1"
                    class="text-white/30"
                  >
                    ·
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        class="border-t border-white/10 bg-[#080808]"
      >
        <div class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div class="space-y-10">
            <div class="max-w-3xl space-y-4">
              <p class="text-xs uppercase tracking-[0.3em] text-blue-300">
                About us
              </p>
              <h2 class="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Our films talk about us.
              </h2>
              <p class="text-sm leading-7 text-white/68 sm:text-base">
                We build commercials and branded stories with a strong sense of rhythm, a sharp eye for audience taste, and a lean creative process that keeps the output direct.
              </p>
            </div>

            <div class="grid gap-6 sm:grid-cols-2">
              <div class="border-b border-white/10 pb-6 sm:border-b-0 sm:border-r sm:border-white/10 sm:pb-0 sm:pr-6">
                <p class="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                  What we do
                </p>
                <p class="mt-4 text-sm leading-7 text-white/70">
                  Commercials, branded films, and production support shaped for a clear visual finish.
                </p>
              </div>
              <div>
                <p class="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                  Where we work
                </p>
                <p class="mt-4 text-sm leading-7 text-white/70">
                  Based across India and Dubai, collaborating with agencies and brands on polished, immediate work.
                </p>
              </div>
            </div>

            <div>
              <div class="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-blue-300">
                    Team
                  </p>
                  <h3 class="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                    Great vision, great team.
                  </h3>
                </div>
                <p class="max-w-xl text-sm leading-6 text-white/55">
                  A compact core team with directors, producers, and executive production support.
                </p>
              </div>

              <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                <div
                  v-for="member in team"
                  :key="member.name"
                  class="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors duration-200 hover:border-blue-500/35 hover:bg-blue-500/8"
                >
                  <div class="aspect-[4/5] overflow-hidden bg-[#111]">
                    <img
                      v-if="member.photoUrl"
                      :src="member.photoUrl"
                      :alt="member.name"
                      class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    >
                    <div
                      v-else
                      class="h-full w-full flex items-center justify-center text-white/20"
                    >
                      <UIcon name="i-lucide-user" class="text-4xl" />
                    </div>
                  </div>
                  <div class="p-4">
                    <h4 class="text-base font-medium text-white">
                      {{ member.name }}
                    </h4>
                    <p class="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                      {{ member.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        class="border-t border-white/10 bg-[#070707]"
      >
        <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div class="max-w-xl">
              <p class="text-xs uppercase tracking-[0.3em] text-blue-300">
                Services
              </p>
              <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                A focused set of film services built around story and impact.
              </h2>
              <p class="mt-4 text-sm leading-7 text-white/68 sm:text-base">
                From advertising and corporate storytelling to animation and music videos, the studio shapes each format with a direct, polished finish.
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <article
                v-for="service in services"
                :key="service.title"
                class="group rounded-3xl border border-white/10 bg-white/5 p-5 transition-colors duration-200 hover:border-blue-500/35 hover:bg-blue-500/8"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-300 transition-transform duration-200 group-hover:scale-105">
                  <UIcon name="i-lucide-sparkles" class="text-lg" />
                </div>
                <h3 class="mt-4 text-lg font-medium tracking-[-0.02em] text-white">
                  {{ service.title }}
                </h3>
                <p class="mt-3 text-sm leading-7 text-white/65">
                  {{ service.description }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section
        id="portfolio"
        class="border-t border-white/10 bg-[#080808]"
      >
        <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div class="flex flex-wrap items-end justify-between gap-6">
            <div class="max-w-2xl">
              <p class="text-xs uppercase tracking-[0.3em] text-blue-300">
                Portfolio
              </p>
              <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Selected films and commercial work.
              </h2>
            </div>

            <p class="max-w-xl text-sm leading-6 text-white/55">
              A portfolio section gives the homepage a direct showcase of the work the studio is known for.
            </p>
          </div>

          <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div
              v-if="portfolioLoading"
              class="md:col-span-2 xl:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60"
            >
              Loading portfolio items...
            </div>

            <UAlert
              v-else-if="portfolioError"
              class="md:col-span-2 xl:col-span-3"
              color="error"
              variant="soft"
              :title="portfolioError.message"
            />

            <div
              v-else-if="!portfolio.length"
              class="md:col-span-2 xl:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60"
            >
              No portfolio items have been published yet.
            </div>

            <NuxtLink
              v-for="work in portfolio"
              :key="work.title"
              :to="getPortfolioHref(work)"
              target="_blank"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-[#111] transition-colors duration-200 hover:border-blue-500/35 hover:bg-[#151515]"
            >
              <div class="aspect-[16/10] overflow-hidden bg-[#0b0b0b]">
                <img
                  :src="getPortfolioImage(work)"
                  :alt="work.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                >
              </div>
              <div class="p-5">
                <p class="text-xs uppercase tracking-[0.24em] text-white/40">
                  {{ work.category ?? work.client ?? 'Film' }}
                </p>
                <h3 class="mt-3 text-lg font-medium text-white group-hover:text-blue-300">
                  {{ work.title }}
                </h3>
                <p
                  v-if="work.description"
                  class="mt-2 text-sm leading-6 text-white/55 line-clamp-2"
                >
                  {{ work.description }}
                </p>
                <p class="mt-3 text-xs text-white/35">
                  {{ work.year ? `${work.year} · ` : '' }}Watch on YouTube
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section
        id="contact"
        class="border-t border-white/10 bg-[#050505]"
      >
        <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div class="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 lg:p-10">
            <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-blue-300">
                  Get in touch
                </p>
                <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                  Start with a brief and a frame of reference.
                </h2>
                <p class="mt-4 max-w-2xl text-sm leading-7 text-white/68">
                  Email the team at <a
                    href="mailto:navarasacreatives@gmail.com"
                    class="text-blue-300 transition-colors hover:text-blue-200"
                  >navarasacreatives@gmail.com</a>.
                  The interface stays spare, the contrast stays high, and the next action stays obvious.
                </p>
              </div>

              <div class="flex flex-col gap-3 sm:flex-row">
                <UButton
                  to="mailto:navarasacreatives@gmail.com"
                  size="lg"
                  color="primary"
                  icon="i-lucide-message-circle"
                  class="shadow-none"
                >
                  Get in touch
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
