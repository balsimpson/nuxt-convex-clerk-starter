<template>
  <div class="min-h-screen bg-[#f7efe2] text-[#2f2118]">
    <main class="relative overflow-hidden px-4 pb-[4.5rem] pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
      <div class="mx-auto max-w-7xl">
        <UBreadcrumb
          :items="breadcrumbItems"
          separator-icon="i-lucide-chevron-right"
          class="mb-8 text-[#665646]"
        />

        <section class="border-b border-[#d9c9b7] pb-12 lg:pb-16">
          <div class="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:gap-16">
            <div class="max-w-2xl">
              <Motion
                as="p"
                class="mb-5 text-xs font-semibold uppercase text-[#7a4f36]"
                :initial="revealInitial"
                :animate="revealVisible"
                :transition="revealTransition(0.04)"
              >
                About Us
              </Motion>

              <Motion
                as="h1"
                class="font-serif text-5xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
                :initial="revealInitial"
                :animate="revealVisible"
                :transition="revealTransition(0.16)"
              >
                About Manasa
              </Motion>

              <Motion
                as="p"
                class="mt-7 max-w-2xl text-base leading-8 text-[#665646] sm:text-lg"
                :initial="revealInitial"
                :animate="revealVisible"
                :transition="revealTransition(0.28)"
              >
                Manasa Centre for Development and Social Action (commonly known as Manasa) is a grassroots nonprofit organization headquartered in Bangalore, Karnataka, India. Established in 1995 by the late visionary Shri Mathews Philip, Manasa has evolved over the past three decades into a dynamic and deeply rooted civil society organization.
              </Motion>

              <Motion
                as="p"
                class="mt-6 max-w-2xl text-base leading-8 text-[#665646] sm:text-lg"
                :initial="revealInitial"
                :animate="revealVisible"
                :transition="revealTransition(0.4)"
              >
                Manasa Centre for Development and Social Action is committed to building a just, inclusive, and equitable society. Guided by the principles of dignity, empowerment, and participatory development, Manasa has spent over three decades empowering women, children, and marginalized communities across Karnataka and neighboring states.
              </Motion>
            </div>

            <Motion
              as="figure"
              class="border border-[#d0bda8] bg-[#efe2d0] p-2"
              :initial="{ opacity: 0, y: 22, scale: 0.97 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :transition="revealTransition(0.18)"
            >
              <img
                src="/img1.webp"
                alt="Community members connected with Manasa's work"
                class="aspect-[5/4] w-full object-cover object-center lg:aspect-[4/5]"
              >
            </Motion>
          </div>
        </section>

        <section class="pt-10 lg:pt-14">
          <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <Motion
              as="div"
              class="max-w-sm"
              :initial="revealInitial"
              :while-in-view="revealVisible"
              :in-view-options="viewOnce"
              :transition="revealTransition()"
            >
              <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                The Name
              </p>
              <h2 class="mt-4 font-serif text-3xl font-normal leading-tight text-[#2f2118] sm:text-4xl">
                Justice, humanity, and society held together in practice.
              </h2>
            </Motion>

            <div class="space-y-6 text-base leading-8 text-[#4f4134] sm:text-lg">
              <Motion
                as="p"
                :initial="revealInitial"
                :while-in-view="revealVisible"
                :in-view-options="viewOnce"
                :transition="revealTransition(0.08)"
              >
                The name Manasa reflects its core values: <span class="font-semibold text-[#2f2118]">Ma - Manaviya Mathu</span> (Humanity), <span class="font-semibold text-[#2f2118]">Na - Nyayayukta</span> (Justice), and <span class="font-semibold text-[#2f2118]">Sa - Samajakagi</span> (For Society).
              </Motion>

              <Motion
                as="p"
                :initial="revealInitial"
                :while-in-view="revealVisible"
                :in-view-options="viewOnce"
                :transition="revealTransition(0.16)"
              >
                Today, Manasa operates in 10 districts of Karnataka, focusing on preventive, promotive, and rights-restorative interventions. Through community engagement, advocacy, education, and monitoring, Manasa has enabled thousands to claim their rights and lead lives of dignity.
              </Motion>
            </div>
          </div>
        </section>

        <section class="py-12 lg:py-16">
          <div class="grid gap-10 border-y border-[#d9c9b7] py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16 lg:py-14">
            <div class="max-w-2xl">
              <Motion
                as="p"
                class="mb-5 text-xs font-semibold uppercase text-[#7a4f36]"
                :initial="revealInitial"
                :while-in-view="revealVisible"
                :in-view-options="viewOnce"
                :transition="revealTransition()"
              >
                Leadership
              </Motion>

              <Motion
                as="h2"
                class="font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl lg:text-6xl"
                :initial="revealInitial"
                :while-in-view="revealVisible"
                :in-view-options="viewOnce"
                :transition="revealTransition(0.08)"
              >
                The people who shaped and guide Manasa.
              </Motion>

              <Motion
                as="p"
                class="mt-6 text-base leading-8 text-[#665646] sm:text-lg"
                :initial="revealInitial"
                :while-in-view="revealVisible"
                :in-view-options="viewOnce"
                :transition="revealTransition(0.16)"
              >
                Meet the founders and executive leadership guiding Manasa's mission across advocacy and community action.
              </Motion>
            </div>

            <div class="border-t border-[#d9c9b7] lg:border-t-0">
              <Motion
                v-for="(member, index) in leadershipMembers"
                :key="member.name"
                as="article"
                class="grid gap-4 border-b border-[#d9c9b7] py-5 sm:grid-cols-[5.5rem_1fr] sm:gap-5 lg:py-6"
                :initial="{ opacity: 0, y: 18 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :in-view-options="viewOnce"
                :transition="revealTransition(0.12 + index * 0.08)"
              >
                <div class="h-24 w-24 overflow-hidden rounded-full border border-[#8f6240] bg-[#ead6bf] sm:h-20 sm:w-20">
                  <img
                    :src="member.imageUrl"
                    :alt="member.name"
                    class="h-full w-full scale-[1.18] object-cover object-center"
                  >
                </div>

                <div class="min-w-0">
                  <h3 class="font-serif text-2xl leading-tight text-[#2f2118]">
                    {{ member.name }}
                  </h3>
                  <p class="mt-1 text-sm leading-6 text-[#665646] sm:text-base">
                    {{ member.designation }}
                  </p>
                  <details class="group mt-4">
                    <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-[#7a4f36] outline-none [&::-webkit-details-marker]:hidden">
                      <span>Show more</span>
                      <UIcon
                        name="i-lucide-chevron-down"
                        class="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>
                    <p class="mt-3 text-sm leading-7 text-[#665646]">
                      {{ member.bio }}
                    </p>
                  </details>
                </div>
              </Motion>
            </div>
          </div>
        </section>

        <section class="pb-12 lg:pb-16">
          <div class="mb-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div>
              <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                Our Team
              </p>
              <h2 class="mt-4 font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl">
                Board members guiding Manasa's mission.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#665646] sm:text-lg lg:pt-8">
              Meet the board members supporting organizational direction, governance, and long-term public action.
            </p>
          </div>

          <UAlert
            v-if="boardMembersError"
            color="error"
            variant="soft"
            :title="boardMembersError.message"
            class="mt-6"
          />

          <div
            v-else-if="boardMembersPending"
            class="grid border-t border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="index in 6"
              :key="index"
              class="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-[#d9c9b7] py-5 sm:px-5 sm:odd:border-r lg:[&:not(:nth-child(3n))]:border-r"
            >
              <USkeleton class="h-16 w-16 rounded-full bg-[#eadfce]" />
              <div class="min-w-0 space-y-3 pt-1">
                <USkeleton class="h-3 w-24 rounded-none bg-[#eadfce]" />
                <USkeleton class="h-5 w-40 rounded-none bg-[#eadfce]" />
                <USkeleton class="h-3 w-28 rounded-none bg-[#eadfce]" />
              </div>
            </div>
          </div>

          <div
            v-else-if="!boardMembers?.length"
            class="border-y border-[#d9c9b7] py-5 text-sm text-[#665646]"
          >
            No board members found.
          </div>

          <div
            v-else
            class="grid border-t border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
          >
            <Motion
              v-for="member in boardMembers"
              :key="member._id"
              as="article"
              class="grid grid-cols-[4.5rem_1fr] items-start gap-4 border-b border-[#d9c9b7] py-5 sm:px-5 sm:odd:border-r lg:[&:not(:nth-child(3n))]:border-r"
              :initial="{ opacity: 0, y: 18 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.08)"
            >
              <div class="h-16 w-16 overflow-hidden rounded-full border border-[#8f6240] bg-[#ead6bf]">
                <img
                  :src="member.imageUrl || '/img1.webp'"
                  :alt="member.fullname"
                  loading="lazy"
                  class="h-full w-full scale-[1.18] object-cover object-center"
                >
              </div>

              <div class="min-w-0">
                <h3 class="truncate font-serif text-xl leading-tight text-[#2f2118]">
                  {{ member.fullname }}
                </h3>
                <p class="mt-1 truncate text-sm leading-6 text-[#665646]">
                  {{ member.designation }}
                </p>
              </div>
            </Motion>
          </div>
        </section>

        <section class="pb-12 lg:pb-16">
          <div class="mb-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div>
              <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                Staff
              </p>
              <h2 class="mt-4 font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl">
                The team carrying programs into daily work.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#665646] sm:text-lg lg:pt-8">
              Meet the staff supporting Manasa's programs, partnerships, and day-to-day community work.
            </p>
          </div>

          <UAlert
            v-if="staffMembersError"
            color="error"
            variant="soft"
            :title="staffMembersError.message"
            class="mt-6"
          />

          <div
            v-else-if="staffMembersPending"
            class="grid border-t border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="index in 6"
              :key="index"
              class="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-[#d9c9b7] py-5 sm:px-5 sm:odd:border-r lg:[&:not(:nth-child(3n))]:border-r"
            >
              <USkeleton class="h-16 w-16 rounded-full bg-[#eadfce]" />
              <div class="min-w-0 space-y-3 pt-1">
                <USkeleton class="h-3 w-24 rounded-none bg-[#eadfce]" />
                <USkeleton class="h-5 w-40 rounded-none bg-[#eadfce]" />
                <USkeleton class="h-3 w-28 rounded-none bg-[#eadfce]" />
              </div>
            </div>
          </div>

          <div
            v-else-if="!staffMembers?.length"
            class="border-y border-[#d9c9b7] py-5 text-sm text-[#665646]"
          >
            No staff members found.
          </div>

          <div
            v-else
            class="grid border-t border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
          >
            <Motion
              v-for="member in staffMembers"
              :key="member._id"
              as="article"
              class="grid grid-cols-[4.5rem_1fr] items-start gap-4 border-b border-[#d9c9b7] py-5 sm:px-5 sm:odd:border-r lg:[&:not(:nth-child(3n))]:border-r"
              :initial="{ opacity: 0, y: 18 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.08)"
            >
              <div class="h-16 w-16 overflow-hidden rounded-full border border-[#8f6240] bg-[#ead6bf]">
                <img
                  :src="member.imageUrl || '/img1.webp'"
                  :alt="member.fullname"
                  loading="lazy"
                  class="h-full w-full scale-[1.18] object-cover object-center"
                >
              </div>

              <div class="min-w-0">
                <h3 class="truncate font-serif text-xl leading-tight text-[#2f2118]">
                  {{ member.fullname }}
                </h3>
                <p class="mt-1 truncate text-sm leading-6 text-[#665646]">
                  {{ member.designation }}
                </p>
              </div>
            </Motion>
          </div>
        </section>

        <section class="pb-12 lg:pb-16">
          <div class="mb-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div>
              <p class="text-xs font-semibold uppercase text-[#7a4f36]">
                District Coordinators
              </p>
              <h2 class="mt-4 font-serif text-4xl font-normal leading-[1.02] text-[#2f2118] text-balance sm:text-5xl">
                Local coordination across the regions Manasa serves.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#665646] sm:text-lg lg:pt-8">
              Meet the district coordinators supporting Manasa's work across the regions it serves.
            </p>
          </div>

          <UAlert
            v-if="districtCoordinatorsError"
            color="error"
            variant="soft"
            :title="districtCoordinatorsError.message"
            class="mt-6"
          />

          <div
            v-else-if="districtCoordinatorsPending"
            class="grid border-t border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="index in 6"
              :key="index"
              class="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-[#d9c9b7] py-5 sm:px-5 sm:odd:border-r lg:[&:not(:nth-child(3n))]:border-r"
            >
              <USkeleton class="h-16 w-16 rounded-full bg-[#eadfce]" />
              <div class="min-w-0 space-y-3 pt-1">
                <USkeleton class="h-3 w-24 rounded-none bg-[#eadfce]" />
                <USkeleton class="h-5 w-40 rounded-none bg-[#eadfce]" />
                <USkeleton class="h-3 w-28 rounded-none bg-[#eadfce]" />
              </div>
            </div>
          </div>

          <div
            v-else-if="!districtCoordinators?.length"
            class="border-y border-[#d9c9b7] py-5 text-sm text-[#665646]"
          >
            No district coordinators found.
          </div>

          <div
            v-else
            class="grid border-t border-[#d9c9b7] sm:grid-cols-2 lg:grid-cols-3"
          >
            <Motion
              v-for="member in districtCoordinators"
              :key="member._id"
              as="article"
              class="grid grid-cols-[4.5rem_1fr] items-start gap-4 border-b border-[#d9c9b7] py-5 sm:px-5 sm:odd:border-r lg:[&:not(:nth-child(3n))]:border-r"
              :initial="{ opacity: 0, y: 18 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :in-view-options="viewOnce"
              :transition="revealTransition(0.08)"
            >
              <div class="h-16 w-16 overflow-hidden rounded-full border border-[#8f6240] bg-[#ead6bf]">
                <img
                  :src="member.imageUrl || '/img1.webp'"
                  :alt="member.fullname"
                  loading="lazy"
                  class="h-full w-full scale-[1.18] object-cover object-center"
                >
              </div>

              <div class="min-w-0">
                <h3 class="truncate font-serif text-xl leading-tight text-[#2f2118]">
                  {{ member.fullname }}
                </h3>
                <p class="mt-1 truncate text-sm leading-6 text-[#665646]">
                  {{ member.designation }}
                </p>
              </div>
            </Motion>
          </div>
        </section>

        <section>
          <div class="border-t border-[#d9c9b7] pt-10 lg:pt-14">
            <p class="mb-5 text-xs font-semibold uppercase text-[#7a4f36]">
              In the Community
            </p>
            <div class="grid gap-3 sm:grid-cols-2">
              <figure
                v-for="image in communityImages"
                :key="image.src"
                class="border border-[#d0bda8] bg-[#efe2d0] p-2"
              >
                <img
                  :src="image.src"
                  :alt="image.alt"
                  loading="lazy"
                  class="aspect-[4/3] w-full object-cover"
                  :class="image.class"
                >
              </figure>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { api } from '../../convex/_generated/api'
import { useConvexQuery } from 'convex-vue'

const motionEase = [0.22, 1, 0.36, 1] as [number, number, number, number]
const revealInitial = { opacity: 0, y: 28 }
const revealVisible = { opacity: 1, y: 0 }
const viewOnce = { once: true, amount: 0.24, margin: '0px 0px -90px 0px' } as const

function revealTransition(delay = 0) {
  return { duration: 0.76, delay, ease: motionEase }
}

const leadershipMembers = [
  {
    name: 'Late Shri. Mathews Philip',
    designation: 'Founder',
    category: 'Founding Leadership',
    imageUrl: '/mathew-philip.jpeg',
    bio: 'A visionary founder who established Manasa in 1995 and shaped its long-term commitment to community-based development and social action.'
  },
  {
    name: 'Mariam Mathews',
    designation: 'Executive Director & Secretary',
    category: 'Executive Leadership',
    imageUrl: '/mariam.jpeg',
    bio: 'Leads the organization’s day-to-day strategy, partnerships, and program direction with a focus on inclusive, rights-based work.'
  }
] satisfies Array<{
  name: string
  designation: string
  category: string
  imageUrl: string
  bio: string
}>

const communityImages = [
  {
    src: '/aboutus1.jpeg',
    alt: 'Manasa community program gathering',
    class: ''
  },
  {
    src: '/aboutus2.jpeg',
    alt: 'Manasa team working with community members',
    class: ''
  },
  {
    src: '/aboutus3.jpeg',
    alt: 'Participants at a Manasa outreach program',
    class: 'object-bottom'
  },
  {
    src: '/aboutus4.jpeg',
    alt: 'Community members during a Manasa field activity',
    class: 'object-bottom'
  }
] as const

const {
  data: boardMembers,
  isPending: boardMembersPending,
  error: boardMembersError
} = useConvexQuery(api.team.listByCategory, {
  category: 'Board Member',
  limit: 100
})

const {
  data: staffMembers,
  isPending: staffMembersPending,
  error: staffMembersError
} = useConvexQuery(api.team.listByCategory, {
  category: 'Staff',
  limit: 100
})

const {
  data: districtCoordinators,
  isPending: districtCoordinatorsPending,
  error: districtCoordinatorsError
} = useConvexQuery(api.team.listByCategory, {
  category: 'Co-ordinator',
  limit: 100
})

const breadcrumbItems = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'About Us'
  }
] satisfies BreadcrumbItem[]
</script>
