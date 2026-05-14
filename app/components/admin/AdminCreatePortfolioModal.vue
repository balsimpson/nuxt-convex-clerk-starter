<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import type { Id } from '../../../convex/_generated/dataModel'
import { api } from '../../../convex/_generated/api'
import { useConvexClient, useConvexMutation } from 'convex-vue'
import { extractYouTubeVideoId, type YouTubeVideoMetadata } from '~/lib/youtube'

const youtubeMetadata = useYouTubeVideoMetadata()
const convex = useConvexClient()

type PortfolioItem = {
  _id: Id<'portfolio'>
  title: string
  videoUrl: string
  thumbnailUrl?: string
  client?: string
  productionHouse?: string
  executiveProducer?: string
  associateProducer?: string
  productionDesigner?: string
  lineProducer?: string
  juniorProducer?: string
  costumeStylist?: string
  makeup?: string
  hair?: string
  firstAD?: string
  secondAD?: string
  firstAC?: string
  focusPuller?: string
  editor?: string
  musicDirector?: string
  vfx?: string
  colorist?: string
  soundFxAndMixing?: string
  assistantEditor?: string
  postTeam?: string
  account?: string
  category?: string
  tags: string[]
  brand?: string
  agency?: string
  director?: string
  dop?: string
  producer?: string
  year?: number
  description?: string
  featured: boolean
  published: boolean
  sortOrder: number
  notes?: string
}

type PortfolioPrefill = {
  client?: string
  productionHouse?: string
  executiveProducer?: string
  associateProducer?: string
  productionDesigner?: string
  lineProducer?: string
  juniorProducer?: string
  costumeStylist?: string
  makeup?: string
  hair?: string
  firstAD?: string
  secondAD?: string
  firstAC?: string
  focusPuller?: string
  editor?: string
  musicDirector?: string
  vfx?: string
  colorist?: string
  soundFxAndMixing?: string
  assistantEditor?: string
  postTeam?: string
  account?: string
  category?: string
  tags: string[]
  brand?: string
  agency?: string
  director?: string
  dop?: string
  producer?: string
  year?: number
  description?: string
  notes?: string
}

const open = defineModel<boolean>('open', {
  default: false
})

const props = defineProps<{
  editItem?: PortfolioItem | null
}>()

const isEditMode = computed(() => !!props.editItem)

function createDefaultForm() {
  return {
    videoUrl: '',
    title: '',
    thumbnailUrl: '',
    client: '',
    productionHouse: '',
    executiveProducer: '',
    associateProducer: '',
    productionDesigner: '',
    lineProducer: '',
    juniorProducer: '',
    costumeStylist: '',
    makeup: '',
    hair: '',
    firstAD: '',
    secondAD: '',
    firstAC: '',
    focusPuller: '',
    editor: '',
    musicDirector: '',
    vfx: '',
    colorist: '',
    soundFxAndMixing: '',
    assistantEditor: '',
    postTeam: '',
    account: '',
    category: '',
    tags: [] as string[],
    brand: '',
    agency: '',
    director: '',
    dop: '',
    producer: '',
    year: '',
    description: '',
    featured: false,
    published: true,
    sortOrder: '0',
    notes: ''
  }
}

function formFromItem(item: PortfolioItem) {
  return {
    videoUrl: item.videoUrl ?? '',
    title: item.title ?? '',
    thumbnailUrl: item.thumbnailUrl ?? '',
    client: item.client ?? '',
    productionHouse: item.productionHouse ?? '',
    executiveProducer: item.executiveProducer ?? '',
    associateProducer: item.associateProducer ?? '',
    productionDesigner: item.productionDesigner ?? '',
    lineProducer: item.lineProducer ?? '',
    juniorProducer: item.juniorProducer ?? '',
    costumeStylist: item.costumeStylist ?? '',
    makeup: item.makeup ?? '',
    hair: item.hair ?? '',
    firstAD: item.firstAD ?? '',
    secondAD: item.secondAD ?? '',
    firstAC: item.firstAC ?? '',
    focusPuller: item.focusPuller ?? '',
    editor: item.editor ?? '',
    musicDirector: item.musicDirector ?? '',
    vfx: item.vfx ?? '',
    colorist: item.colorist ?? '',
    soundFxAndMixing: item.soundFxAndMixing ?? '',
    assistantEditor: item.assistantEditor ?? '',
    postTeam: item.postTeam ?? '',
    account: item.account ?? '',
    category: item.category ?? '',
    tags: item.tags ? [...item.tags] : [],
    brand: item.brand ?? '',
    agency: item.agency ?? '',
    director: item.director ?? '',
    dop: item.dop ?? '',
    producer: item.producer ?? '',
    year: item.year !== undefined ? String(item.year) : '',
    description: item.description ?? '',
    featured: item.featured ?? false,
    published: item.published ?? true,
    sortOrder: item.sortOrder !== undefined ? String(item.sortOrder) : '0',
    notes: item.notes ?? ''
  }
}

const form = reactive(createDefaultForm())
const submitError = ref('')
const lastAutofilledYoutubeTitle = ref('')
const lastAutofilledYoutubeThumbnailUrl = ref('')
const lastAutofilledPortfolioValues = reactive({
  client: '',
  productionHouse: '',
  executiveProducer: '',
  associateProducer: '',
  productionDesigner: '',
  lineProducer: '',
  juniorProducer: '',
  costumeStylist: '',
  makeup: '',
  hair: '',
  firstAD: '',
  secondAD: '',
  firstAC: '',
  focusPuller: '',
  editor: '',
  musicDirector: '',
  vfx: '',
  colorist: '',
  soundFxAndMixing: '',
  assistantEditor: '',
  postTeam: '',
  account: '',
  category: '',
  tags: [] as string[],
  brand: '',
  agency: '',
  director: '',
  dop: '',
  producer: '',
  year: '',
  description: '',
  notes: ''
})

const { mutate: createPortfolio, isPending: isCreating, error: createError } = useConvexMutation(api.portfolio.create)
const { mutate: updatePortfolio, isPending: isUpdating, error: updateError } = useConvexMutation(api.portfolio.update)

const isPending = computed(() => isCreating.value || isUpdating.value)
const error = computed(() => createError.value || updateError.value)

function resetForm() {
  prefillRequestId += 1
  Object.assign(form, createDefaultForm())
  submitError.value = ''
  youtubeMetadata.clear()
  lastAutofilledYoutubeTitle.value = ''
  lastAutofilledYoutubeThumbnailUrl.value = ''
  lastAutofilledPortfolioValues.client = ''
  lastAutofilledPortfolioValues.productionHouse = ''
  lastAutofilledPortfolioValues.executiveProducer = ''
  lastAutofilledPortfolioValues.associateProducer = ''
  lastAutofilledPortfolioValues.productionDesigner = ''
  lastAutofilledPortfolioValues.lineProducer = ''
  lastAutofilledPortfolioValues.juniorProducer = ''
  lastAutofilledPortfolioValues.costumeStylist = ''
  lastAutofilledPortfolioValues.makeup = ''
  lastAutofilledPortfolioValues.hair = ''
  lastAutofilledPortfolioValues.firstAD = ''
  lastAutofilledPortfolioValues.secondAD = ''
  lastAutofilledPortfolioValues.firstAC = ''
  lastAutofilledPortfolioValues.focusPuller = ''
  lastAutofilledPortfolioValues.editor = ''
  lastAutofilledPortfolioValues.musicDirector = ''
  lastAutofilledPortfolioValues.vfx = ''
  lastAutofilledPortfolioValues.colorist = ''
  lastAutofilledPortfolioValues.soundFxAndMixing = ''
  lastAutofilledPortfolioValues.assistantEditor = ''
  lastAutofilledPortfolioValues.postTeam = ''
  lastAutofilledPortfolioValues.account = ''
  lastAutofilledPortfolioValues.category = ''
  lastAutofilledPortfolioValues.tags = []
  lastAutofilledPortfolioValues.brand = ''
  lastAutofilledPortfolioValues.agency = ''
  lastAutofilledPortfolioValues.director = ''
  lastAutofilledPortfolioValues.dop = ''
  lastAutofilledPortfolioValues.producer = ''
  lastAutofilledPortfolioValues.year = ''
  lastAutofilledPortfolioValues.description = ''
  lastAutofilledPortfolioValues.notes = ''
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return undefined

  const parsed = Number(trimmed)

  if (!Number.isFinite(parsed)) {
    throw new Error('Enter a valid number')
  }

  return parsed
}

async function submit() {
  submitError.value = ''

  const title = form.title.trim()
  const videoUrl = form.videoUrl.trim()
  const year = parseOptionalNumber(form.year)
  const sortOrder = parseOptionalNumber(form.sortOrder)

  if (!title) {
    throw new Error('Title is required')
  }

  if (!videoUrl) {
    throw new Error('YouTube link is required')
  }

  if (sortOrder === undefined) {
    throw new Error('Sort order is required')
  }

  if (isEditMode.value && props.editItem) {
    await updatePortfolio({
      id: props.editItem._id,
      title,
      videoUrl,
      tags: form.tags.map(tag => tag.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published,
      sortOrder,
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      client: form.client.trim() || undefined,
      productionHouse: form.productionHouse.trim() || undefined,
      executiveProducer: form.executiveProducer.trim() || undefined,
      associateProducer: form.associateProducer.trim() || undefined,
      productionDesigner: form.productionDesigner.trim() || undefined,
      lineProducer: form.lineProducer.trim() || undefined,
      juniorProducer: form.juniorProducer.trim() || undefined,
      costumeStylist: form.costumeStylist.trim() || undefined,
      makeup: form.makeup.trim() || undefined,
      hair: form.hair.trim() || undefined,
      firstAD: form.firstAD.trim() || undefined,
      secondAD: form.secondAD.trim() || undefined,
      firstAC: form.firstAC.trim() || undefined,
      focusPuller: form.focusPuller.trim() || undefined,
      editor: form.editor.trim() || undefined,
      musicDirector: form.musicDirector.trim() || undefined,
      vfx: form.vfx.trim() || undefined,
      colorist: form.colorist.trim() || undefined,
      soundFxAndMixing: form.soundFxAndMixing.trim() || undefined,
      assistantEditor: form.assistantEditor.trim() || undefined,
      postTeam: form.postTeam.trim() || undefined,
      account: form.account.trim() || undefined,
      description: form.description.trim() || undefined,
      category: form.category.trim() || undefined,
      brand: form.brand.trim() || undefined,
      agency: form.agency.trim() || undefined,
      director: form.director.trim() || undefined,
      dop: form.dop.trim() || undefined,
      producer: form.producer.trim() || undefined,
      year: year,
      notes: form.notes.trim() || undefined
    })
  } else {
    const payload = {
      title,
      videoUrl,
      tags: form.tags.map(tag => tag.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published,
      sortOrder,
      ...(form.thumbnailUrl.trim() ? { thumbnailUrl: form.thumbnailUrl.trim() } : {}),
      ...(form.client.trim() ? { client: form.client.trim() } : {}),
      ...(form.productionHouse.trim() ? { productionHouse: form.productionHouse.trim() } : {}),
      ...(form.executiveProducer.trim() ? { executiveProducer: form.executiveProducer.trim() } : {}),
      ...(form.associateProducer.trim() ? { associateProducer: form.associateProducer.trim() } : {}),
      ...(form.productionDesigner.trim() ? { productionDesigner: form.productionDesigner.trim() } : {}),
      ...(form.lineProducer.trim() ? { lineProducer: form.lineProducer.trim() } : {}),
      ...(form.juniorProducer.trim() ? { juniorProducer: form.juniorProducer.trim() } : {}),
      ...(form.costumeStylist.trim() ? { costumeStylist: form.costumeStylist.trim() } : {}),
      ...(form.makeup.trim() ? { makeup: form.makeup.trim() } : {}),
      ...(form.hair.trim() ? { hair: form.hair.trim() } : {}),
      ...(form.firstAD.trim() ? { firstAD: form.firstAD.trim() } : {}),
      ...(form.secondAD.trim() ? { secondAD: form.secondAD.trim() } : {}),
      ...(form.firstAC.trim() ? { firstAC: form.firstAC.trim() } : {}),
      ...(form.focusPuller.trim() ? { focusPuller: form.focusPuller.trim() } : {}),
      ...(form.editor.trim() ? { editor: form.editor.trim() } : {}),
      ...(form.musicDirector.trim() ? { musicDirector: form.musicDirector.trim() } : {}),
      ...(form.vfx.trim() ? { vfx: form.vfx.trim() } : {}),
      ...(form.colorist.trim() ? { colorist: form.colorist.trim() } : {}),
      ...(form.soundFxAndMixing.trim() ? { soundFxAndMixing: form.soundFxAndMixing.trim() } : {}),
      ...(form.assistantEditor.trim() ? { assistantEditor: form.assistantEditor.trim() } : {}),
      ...(form.postTeam.trim() ? { postTeam: form.postTeam.trim() } : {}),
      ...(form.account.trim() ? { account: form.account.trim() } : {}),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      ...(form.category.trim() ? { category: form.category.trim() } : {}),
      ...(form.brand.trim() ? { brand: form.brand.trim() } : {}),
      ...(form.agency.trim() ? { agency: form.agency.trim() } : {}),
      ...(form.director.trim() ? { director: form.director.trim() } : {}),
      ...(form.dop.trim() ? { dop: form.dop.trim() } : {}),
      ...(form.producer.trim() ? { producer: form.producer.trim() } : {}),
      ...(year !== undefined ? { year } : {}),
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {})
    }

    await createPortfolio(payload)
  }

  resetForm()
  open.value = false
}

function closeModal(close: () => void) {
  resetForm()
  close()
}

function savePortfolio() {
  submit().catch((err) => {
    submitError.value = err instanceof Error ? err.message : 'Failed to save portfolio item'
  })
}

const displayError = computed(() => submitError.value || error.value?.message || '')

// When modal opens in edit mode, populate form from editItem
watch(open, (value) => {
  if (value && props.editItem) {
    Object.assign(form, formFromItem(props.editItem))
    submitError.value = ''
  } else if (!value) {
    resetForm()
  }
})

// Also react if editItem changes while modal is open
watch(() => props.editItem, (item) => {
  if (open.value && item) {
    Object.assign(form, formFromItem(item))
    submitError.value = ''
  }
})

function getYoutubeVideoId(url: string) {
  return extractYouTubeVideoId(url) ?? ''
}

function applyYoutubeMetadata({ title, thumbnailUrl }: YouTubeVideoMetadata) {
  if (!title) return

  if (!form.title.trim() || form.title === lastAutofilledYoutubeTitle.value) {
    form.title = title
    lastAutofilledYoutubeTitle.value = title
  }

  if (!form.thumbnailUrl.trim() || form.thumbnailUrl === lastAutofilledYoutubeThumbnailUrl.value) {
    form.thumbnailUrl = thumbnailUrl
    lastAutofilledYoutubeThumbnailUrl.value = thumbnailUrl
  }
}

function applyPortfolioPrefill(details: PortfolioPrefill) {
  if (!form.client.trim() || form.client === lastAutofilledPortfolioValues.client) {
    form.client = details.client ?? ''
    lastAutofilledPortfolioValues.client = details.client ?? ''
  }

  if (
    !form.productionHouse.trim()
    || form.productionHouse === lastAutofilledPortfolioValues.productionHouse
  ) {
    form.productionHouse = details.productionHouse ?? ''
    lastAutofilledPortfolioValues.productionHouse = details.productionHouse ?? ''
  }

  if (
    !form.executiveProducer.trim()
    || form.executiveProducer === lastAutofilledPortfolioValues.executiveProducer
  ) {
    form.executiveProducer = details.executiveProducer ?? ''
    lastAutofilledPortfolioValues.executiveProducer = details.executiveProducer ?? ''
  }

  if (
    !form.associateProducer.trim()
    || form.associateProducer === lastAutofilledPortfolioValues.associateProducer
  ) {
    form.associateProducer = details.associateProducer ?? ''
    lastAutofilledPortfolioValues.associateProducer = details.associateProducer ?? ''
  }

  if (
    !form.productionDesigner.trim()
    || form.productionDesigner === lastAutofilledPortfolioValues.productionDesigner
  ) {
    form.productionDesigner = details.productionDesigner ?? ''
    lastAutofilledPortfolioValues.productionDesigner = details.productionDesigner ?? ''
  }

  if (!form.lineProducer.trim() || form.lineProducer === lastAutofilledPortfolioValues.lineProducer) {
    form.lineProducer = details.lineProducer ?? ''
    lastAutofilledPortfolioValues.lineProducer = details.lineProducer ?? ''
  }

  if (
    !form.juniorProducer.trim()
    || form.juniorProducer === lastAutofilledPortfolioValues.juniorProducer
  ) {
    form.juniorProducer = details.juniorProducer ?? ''
    lastAutofilledPortfolioValues.juniorProducer = details.juniorProducer ?? ''
  }

  if (
    !form.costumeStylist.trim()
    || form.costumeStylist === lastAutofilledPortfolioValues.costumeStylist
  ) {
    form.costumeStylist = details.costumeStylist ?? ''
    lastAutofilledPortfolioValues.costumeStylist = details.costumeStylist ?? ''
  }

  if (!form.makeup.trim() || form.makeup === lastAutofilledPortfolioValues.makeup) {
    form.makeup = details.makeup ?? ''
    lastAutofilledPortfolioValues.makeup = details.makeup ?? ''
  }

  if (!form.hair.trim() || form.hair === lastAutofilledPortfolioValues.hair) {
    form.hair = details.hair ?? ''
    lastAutofilledPortfolioValues.hair = details.hair ?? ''
  }

  if (!form.firstAD.trim() || form.firstAD === lastAutofilledPortfolioValues.firstAD) {
    form.firstAD = details.firstAD ?? ''
    lastAutofilledPortfolioValues.firstAD = details.firstAD ?? ''
  }

  if (!form.secondAD.trim() || form.secondAD === lastAutofilledPortfolioValues.secondAD) {
    form.secondAD = details.secondAD ?? ''
    lastAutofilledPortfolioValues.secondAD = details.secondAD ?? ''
  }

  if (!form.firstAC.trim() || form.firstAC === lastAutofilledPortfolioValues.firstAC) {
    form.firstAC = details.firstAC ?? ''
    lastAutofilledPortfolioValues.firstAC = details.firstAC ?? ''
  }

  if (!form.focusPuller.trim() || form.focusPuller === lastAutofilledPortfolioValues.focusPuller) {
    form.focusPuller = details.focusPuller ?? ''
    lastAutofilledPortfolioValues.focusPuller = details.focusPuller ?? ''
  }

  if (!form.editor.trim() || form.editor === lastAutofilledPortfolioValues.editor) {
    form.editor = details.editor ?? ''
    lastAutofilledPortfolioValues.editor = details.editor ?? ''
  }

  if (
    !form.musicDirector.trim()
    || form.musicDirector === lastAutofilledPortfolioValues.musicDirector
  ) {
    form.musicDirector = details.musicDirector ?? ''
    lastAutofilledPortfolioValues.musicDirector = details.musicDirector ?? ''
  }

  if (!form.vfx.trim() || form.vfx === lastAutofilledPortfolioValues.vfx) {
    form.vfx = details.vfx ?? ''
    lastAutofilledPortfolioValues.vfx = details.vfx ?? ''
  }

  if (!form.colorist.trim() || form.colorist === lastAutofilledPortfolioValues.colorist) {
    form.colorist = details.colorist ?? ''
    lastAutofilledPortfolioValues.colorist = details.colorist ?? ''
  }

  if (
    !form.soundFxAndMixing.trim()
    || form.soundFxAndMixing === lastAutofilledPortfolioValues.soundFxAndMixing
  ) {
    form.soundFxAndMixing = details.soundFxAndMixing ?? ''
    lastAutofilledPortfolioValues.soundFxAndMixing = details.soundFxAndMixing ?? ''
  }

  if (
    !form.assistantEditor.trim()
    || form.assistantEditor === lastAutofilledPortfolioValues.assistantEditor
  ) {
    form.assistantEditor = details.assistantEditor ?? ''
    lastAutofilledPortfolioValues.assistantEditor = details.assistantEditor ?? ''
  }

  if (!form.postTeam.trim() || form.postTeam === lastAutofilledPortfolioValues.postTeam) {
    form.postTeam = details.postTeam ?? ''
    lastAutofilledPortfolioValues.postTeam = details.postTeam ?? ''
  }

  if (!form.account.trim() || form.account === lastAutofilledPortfolioValues.account) {
    form.account = details.account ?? ''
    lastAutofilledPortfolioValues.account = details.account ?? ''
  }

  if (!form.category.trim() || form.category === lastAutofilledPortfolioValues.category) {
    form.category = details.category ?? ''
    lastAutofilledPortfolioValues.category = details.category ?? ''
  }

  if (
    (!form.tags.length && details.tags.length > 0)
    || form.tags.join('\u0000') === lastAutofilledPortfolioValues.tags.join('\u0000')
  ) {
    form.tags = [...details.tags]
    lastAutofilledPortfolioValues.tags = [...details.tags]
  }

  if (!form.brand.trim() || form.brand === lastAutofilledPortfolioValues.brand) {
    form.brand = details.brand ?? ''
    lastAutofilledPortfolioValues.brand = details.brand ?? ''
  }

  if (!form.agency.trim() || form.agency === lastAutofilledPortfolioValues.agency) {
    form.agency = details.agency ?? ''
    lastAutofilledPortfolioValues.agency = details.agency ?? ''
  }

  if (!form.director.trim() || form.director === lastAutofilledPortfolioValues.director) {
    form.director = details.director ?? ''
    lastAutofilledPortfolioValues.director = details.director ?? ''
  }

  if (!form.dop.trim() || form.dop === lastAutofilledPortfolioValues.dop) {
    form.dop = details.dop ?? ''
    lastAutofilledPortfolioValues.dop = details.dop ?? ''
  }

  if (!form.producer.trim() || form.producer === lastAutofilledPortfolioValues.producer) {
    form.producer = details.producer ?? ''
    lastAutofilledPortfolioValues.producer = details.producer ?? ''
  }

  if (!form.year.trim() || form.year === lastAutofilledPortfolioValues.year) {
    const year = details.year ? String(details.year) : ''
    form.year = year
    lastAutofilledPortfolioValues.year = year
  }

  if (!form.description.trim() || form.description === lastAutofilledPortfolioValues.description) {
    form.description = details.description ?? ''
    lastAutofilledPortfolioValues.description = details.description ?? ''
  }

  if (!form.notes.trim() || form.notes === lastAutofilledPortfolioValues.notes) {
    form.notes = details.notes ?? ''
    lastAutofilledPortfolioValues.notes = details.notes ?? ''
  }
}

function markTitleEdited() {
  lastAutofilledYoutubeTitle.value = ''
}

function markDescriptionEdited() {
  lastAutofilledPortfolioValues.description = ''
}

function markThumbnailEdited() {
  lastAutofilledYoutubeThumbnailUrl.value = ''
}

let prefillRequestId = 0

watch(
  () => form.videoUrl,
  (value, _, onCleanup) => {
    // Skip auto-prefill in edit mode to avoid overwriting existing data
    if (isEditMode.value) return

    const currentRequestId = ++prefillRequestId
    const videoId = getYoutubeVideoId(value)

    if (!videoId) {
      return
    }

    const timeout = setTimeout(async () => {
      const metadata = await youtubeMetadata.lookup(value)

      if (!metadata || currentRequestId !== prefillRequestId) {
        return
      }

      applyYoutubeMetadata(metadata)

      if (!metadata.description.trim()) {
        return
      }

      try {
        const details = await convex.action(api.portfolioPrefill.prefillFromYoutubeDescription, {
          title: metadata.title,
          description: metadata.description
        }) as PortfolioPrefill

        if (currentRequestId !== prefillRequestId) {
          return
        }

        applyPortfolioPrefill(details)
      } catch (error) {
        if (currentRequestId !== prefillRequestId) {
          return
        }

        console.error('Failed to prefill portfolio details from YouTube description', error)
      }
    }, 350)

    onCleanup(() => {
      clearTimeout(timeout)
    })
  }
)

const sections = [
  {
    label: 'Core',
    icon: 'i-lucide-play',
    slot: 'core'
  },
  {
    label: 'Credits',
    icon: 'i-lucide-pen-line',
    slot: 'credits'
  },
  {
    label: 'Crew',
    icon: 'i-lucide-check-square',
    slot: 'crew'
  },
  {
    label: 'Publish',
    icon: 'i-lucide-badge-check',
    slot: 'publish'
  }
] satisfies AccordionItem[]
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditMode ? 'Edit portfolio item' : 'Portfolio item'"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UCard>
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.24em] text-muted">
              {{ isEditMode ? 'Edit portfolio item' : 'Create portfolio item' }}
            </p>
            <p class="text-sm leading-6 text-muted">
              {{ isEditMode ? 'Update the details below and save.' : 'YouTube link can fill the title and thumbnail.' }}
            </p>
          </div>
        </UCard>

        <UAccordion
          type="multiple"
          :items="sections"
          :default-value="['core']"
          :unmount-on-hide="false"
        >
          <template #core>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField
                label="YouTube link"
                required
              >
                <UInput
                  v-model="form.videoUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </UFormField>

              <UFormField
                label="Title"
                required
              >
                <UInput
                  v-model="form.title"
                  placeholder="Navarasa Show Reel 2023"
                  @update:model-value="markTitleEdited"
                />
              </UFormField>

              <UFormField label="Thumbnail URL">
                <UInput
                  v-model="form.thumbnailUrl"
                  placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg"
                  @update:model-value="markThumbnailEdited"
                />
              </UFormField>

              <UFormField label="Category">
                <UInput
                  v-model="form.category"
                  placeholder="Brand film"
                />
              </UFormField>

              <UFormField label="Year">
                <UInput
                  v-model="form.year"
                  placeholder="2026"
                />
              </UFormField>
            </div>
          </template>

          <template #credits>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Brand">
                <UInput
                  v-model="form.brand"
                  placeholder="Medimix"
                />
              </UFormField>

              <UFormField label="Agency">
                <UInput
                  v-model="form.agency"
                  placeholder="Agency name"
                />
              </UFormField>

              <UFormField label="Director">
                <UInput
                  v-model="form.director"
                  placeholder="Director name"
                />
              </UFormField>

              <UFormField label="DOP">
                <UInput
                  v-model="form.dop"
                  placeholder="Director of photography"
                />
              </UFormField>

              <UFormField label="Producer">
                <UInput
                  v-model="form.producer"
                  placeholder="Producer name"
                />
              </UFormField>

              <UFormField label="Client">
                <UInput
                  v-model="form.client"
                  placeholder="ITC"
                />
              </UFormField>

              <UFormField label="Production House">
                <UInput
                  v-model="form.productionHouse"
                  placeholder="Navarasa Creatives"
                />
              </UFormField>

              <UFormField label="Executive Producer">
                <UInput
                  v-model="form.executiveProducer"
                  placeholder="Abhijith Nair"
                />
              </UFormField>

              <UFormField label="Associate Producer">
                <UInput
                  v-model="form.associateProducer"
                  placeholder="Anil"
                />
              </UFormField>
            </div>
          </template>

          <template #crew>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Production Designer">
                <UInput
                  v-model="form.productionDesigner"
                  placeholder="Subhaash Karun"
                />
              </UFormField>

              <UFormField label="Line Producer">
                <UInput
                  v-model="form.lineProducer"
                  placeholder="Bijay Kumar Lana & Priyanka"
                />
              </UFormField>

              <UFormField label="Junior Producer">
                <UInput
                  v-model="form.juniorProducer"
                  placeholder="Rithun Chacko Itty"
                />
              </UFormField>

              <UFormField label="Costume Stylist">
                <UInput
                  v-model="form.costumeStylist"
                  placeholder="Sanchi Gupta"
                />
              </UFormField>

              <UFormField label="Makeup">
                <UInput
                  v-model="form.makeup"
                  placeholder="Sudhir Ku Dalai"
                />
              </UFormField>

              <UFormField label="Hair">
                <UInput
                  v-model="form.hair"
                  placeholder="Madhu"
                />
              </UFormField>

              <UFormField label="First AD">
                <UInput
                  v-model="form.firstAD"
                  placeholder="Sanju Kadu"
                />
              </UFormField>

              <UFormField label="Second AD">
                <UInput
                  v-model="form.secondAD"
                  placeholder="Sonali Mishra"
                />
              </UFormField>

              <UFormField label="First AC">
                <UInput
                  v-model="form.firstAC"
                  placeholder="Rahul"
                />
              </UFormField>

              <UFormField label="Focus Puller">
                <UInput
                  v-model="form.focusPuller"
                  placeholder="Suresh Pandurang Salawkar"
                />
              </UFormField>

              <UFormField label="Editor">
                <UInput
                  v-model="form.editor"
                  placeholder="Saumya Sharma"
                />
              </UFormField>

              <UFormField label="Music Director">
                <UInput
                  v-model="form.musicDirector"
                  placeholder="Bharat Hitarth"
                />
              </UFormField>

              <UFormField label="VFX">
                <UInput
                  v-model="form.vfx"
                  placeholder="Meraki"
                />
              </UFormField>

              <UFormField label="Colorist">
                <UInput
                  v-model="form.colorist"
                  placeholder="Swapnil Patole (Famous Studios)"
                />
              </UFormField>

              <UFormField label="Sound FX and Mixing">
                <UInput
                  v-model="form.soundFxAndMixing"
                  placeholder="Lijin Alex"
                />
              </UFormField>

              <UFormField label="Assistant Editor">
                <UInput
                  v-model="form.assistantEditor"
                  placeholder="Rimnas"
                />
              </UFormField>

              <UFormField label="Post Team">
                <UInput
                  v-model="form.postTeam"
                  placeholder="Abinanth"
                />
              </UFormField>

              <UFormField label="Account">
                <UInput
                  v-model="form.account"
                  placeholder="Sumesh & Shibu"
                />
              </UFormField>
            </div>
          </template>

          <template #publish>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField
                label="Tags"
                class="sm:col-span-2"
              >
                <UInputTags
                  v-model="form.tags"
                  placeholder="Ad film, TVC, brand film"
                />
              </UFormField>

              <UFormField
                label="Description"
                class="sm:col-span-2"
              >
                <UTextarea
                  v-model="form.description"
                  :rows="4"
                  placeholder="Short description"
                  @update:model-value="markDescriptionEdited"
                />
              </UFormField>
              <UFormField label="Featured">
                <USwitch v-model="form.featured" />
              </UFormField>

              <UFormField label="Published">
                <USwitch v-model="form.published" />
              </UFormField>

              <UFormField label="Sort order">
                <UInput
                  v-model="form.sortOrder"
                  type="number"
                  placeholder="0"
                />
              </UFormField>

              <UFormField
                label="Notes"
                class="sm:col-span-2"
              >
                <UTextarea
                  v-model="form.notes"
                  :rows="4"
                  placeholder="Notes"
                />
              </UFormField>
            </div>
          </template>
        </UAccordion>

        <UAlert
          v-if="displayError"
          color="error"
          variant="soft"
          :title="displayError"
        />
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        color="neutral"
        variant="outline"
        label="Close"
        :disabled="isPending"
        @click="closeModal(close)"
      />

      <UButton
        color="primary"
        :label="isEditMode ? 'Update' : 'Save'"
        :loading="isPending"
        :disabled="isPending"
        @click="savePortfolio"
      />
    </template>
  </UModal>
</template>
