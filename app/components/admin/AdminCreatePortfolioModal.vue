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
  creativeHead?: string
  agencyHead?: string
  servicing?: string
  executiveProducer?: string
  associateProducer?: string
  productionDesigner?: string
  lineProducer?: string
  juniorProducer?: string
  productionManager?: string
  associateDirector?: string
  assistantDirectors?: string
  modelCoordinators?: string
  costumeStylist?: string
  makeup?: string
  hair?: string
  firstAD?: string
  secondAD?: string
  firstAC?: string
  focusPuller?: string
  editor?: string
  musicDirector?: string
  di?: string
  cg?: string
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
  creativeHead?: string
  agencyHead?: string
  servicing?: string
  executiveProducer?: string
  associateProducer?: string
  productionDesigner?: string
  lineProducer?: string
  juniorProducer?: string
  productionManager?: string
  associateDirector?: string
  assistantDirectors?: string
  modelCoordinators?: string
  costumeStylist?: string
  makeup?: string
  hair?: string
  firstAD?: string
  secondAD?: string
  firstAC?: string
  focusPuller?: string
  editor?: string
  musicDirector?: string
  di?: string
  cg?: string
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
    creativeHead: '',
    agencyHead: '',
    servicing: '',
    executiveProducer: '',
    associateProducer: '',
    productionDesigner: '',
    lineProducer: '',
    juniorProducer: '',
    productionManager: '',
    associateDirector: '',
    assistantDirectors: '',
    modelCoordinators: '',
    costumeStylist: '',
    makeup: '',
    hair: '',
    firstAD: '',
    secondAD: '',
    firstAC: '',
    focusPuller: '',
    editor: '',
    musicDirector: '',
    di: '',
    cg: '',
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
    creativeHead: item.creativeHead ?? '',
    agencyHead: item.agencyHead ?? '',
    servicing: item.servicing ?? '',
    executiveProducer: item.executiveProducer ?? '',
    associateProducer: item.associateProducer ?? '',
    productionDesigner: item.productionDesigner ?? '',
    lineProducer: item.lineProducer ?? '',
    juniorProducer: item.juniorProducer ?? '',
    productionManager: item.productionManager ?? '',
    associateDirector: item.associateDirector ?? '',
    assistantDirectors: item.assistantDirectors ?? '',
    modelCoordinators: item.modelCoordinators ?? '',
    costumeStylist: item.costumeStylist ?? '',
    makeup: item.makeup ?? '',
    hair: item.hair ?? '',
    firstAD: item.firstAD ?? '',
    secondAD: item.secondAD ?? '',
    firstAC: item.firstAC ?? '',
    focusPuller: item.focusPuller ?? '',
    editor: item.editor ?? '',
    musicDirector: item.musicDirector ?? '',
    di: item.di ?? '',
    cg: item.cg ?? '',
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
  creativeHead: '',
  agencyHead: '',
  servicing: '',
  executiveProducer: '',
  associateProducer: '',
  productionDesigner: '',
  lineProducer: '',
  juniorProducer: '',
  productionManager: '',
  associateDirector: '',
  assistantDirectors: '',
  modelCoordinators: '',
  costumeStylist: '',
  makeup: '',
  hair: '',
  firstAD: '',
  secondAD: '',
  firstAC: '',
  focusPuller: '',
  editor: '',
  musicDirector: '',
  di: '',
  cg: '',
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
type PrefillStage = 'idle' | 'fetching-video' | 'extracting-details' | 'ready' | 'error'

const prefillStage = ref<PrefillStage>('idle')
const prefillSummary = ref('')

const hasVideoUrl = computed(() => form.videoUrl.trim().length > 0)
const detectedVideoId = computed(() => getYoutubeVideoId(form.videoUrl))
const hasDetectedVideo = computed(() => detectedVideoId.value.length > 0)
const metadataPreview = computed(() => youtubeMetadata.data.value ?? youtubeMetadata.lookupCached(form.videoUrl))
const previewThumbnailUrl = computed(() => form.thumbnailUrl.trim() || metadataPreview.value?.thumbnailUrl || '')
const canSave = computed(() => {
  const hasTitle = form.title.trim().length > 0
  const hasValidYtUrl = getYoutubeVideoId(form.videoUrl).length > 0
  return hasTitle && hasValidYtUrl
})
const activePrefillStage = computed<PrefillStage>(() => {
  if (youtubeMetadata.error.value) return 'error'
  if (prefillStage.value === 'error') return 'error'
  if (prefillStage.value === 'extracting-details') return 'extracting-details'
  if (youtubeMetadata.pending.value || prefillStage.value === 'fetching-video') return 'fetching-video'
  if (prefillStage.value === 'ready') return 'ready'
  return 'idle'
})

const stageMeta = computed(() => {
  switch (activePrefillStage.value) {
    case 'fetching-video':
      return {
        label: 'Fetching video details',
        icon: 'i-lucide-loader-circle',
        tone: 'text-primary'
      }
    case 'extracting-details':
      return {
        label: 'Extracting credits from description',
        icon: 'i-lucide-sparkles',
        tone: 'text-primary'
      }
    case 'ready':
      return {
        label: 'Prefill ready',
        icon: 'i-lucide-badge-check',
        tone: 'text-green-600'
      }
    case 'error':
      return {
        label: 'Prefill needs attention',
        icon: 'i-lucide-alert-circle',
        tone: 'text-error'
      }
    default:
      return {
        label: hasDetectedVideo.value ? 'Link detected' : 'Waiting for a link',
        icon: hasDetectedVideo.value ? 'i-lucide-link-2' : 'i-lucide-play',
        tone: hasDetectedVideo.value ? 'text-primary' : 'text-muted'
      }
  }
})

const extractedFieldCount = computed(() => {
  const values = [
    form.brand,
    form.agency,
    form.director,
    form.creativeHead,
    form.agencyHead,
    form.servicing,
    form.associateDirector,
    form.assistantDirectors,
    form.dop,
    form.producer,
    form.client,
    form.productionHouse,
    form.executiveProducer,
    form.associateProducer,
    form.productionDesigner,
    form.lineProducer,
    form.juniorProducer,
    form.productionManager,
    form.modelCoordinators,
    form.costumeStylist,
    form.makeup,
    form.hair,
    form.firstAD,
    form.secondAD,
    form.firstAC,
    form.focusPuller,
    form.editor,
    form.musicDirector,
    form.di,
    form.cg,
    form.vfx,
    form.colorist,
    form.soundFxAndMixing,
    form.assistantEditor,
    form.postTeam,
    form.account,
    form.category,
    form.year,
    form.description,
    form.notes
  ]

  return values.filter(value => value.trim().length > 0).length + form.tags.length
})

function resetForm() {
  prefillRequestId += 1
  Object.assign(form, createDefaultForm())
  submitError.value = ''
  youtubeMetadata.clear()
  prefillStage.value = 'idle'
  prefillSummary.value = ''
  lastAutofilledYoutubeTitle.value = ''
  lastAutofilledYoutubeThumbnailUrl.value = ''
  lastAutofilledPortfolioValues.client = ''
  lastAutofilledPortfolioValues.productionHouse = ''
  lastAutofilledPortfolioValues.creativeHead = ''
  lastAutofilledPortfolioValues.agencyHead = ''
  lastAutofilledPortfolioValues.servicing = ''
  lastAutofilledPortfolioValues.executiveProducer = ''
  lastAutofilledPortfolioValues.associateProducer = ''
  lastAutofilledPortfolioValues.productionDesigner = ''
  lastAutofilledPortfolioValues.lineProducer = ''
  lastAutofilledPortfolioValues.juniorProducer = ''
  lastAutofilledPortfolioValues.productionManager = ''
  lastAutofilledPortfolioValues.associateDirector = ''
  lastAutofilledPortfolioValues.assistantDirectors = ''
  lastAutofilledPortfolioValues.modelCoordinators = ''
  lastAutofilledPortfolioValues.costumeStylist = ''
  lastAutofilledPortfolioValues.makeup = ''
  lastAutofilledPortfolioValues.hair = ''
  lastAutofilledPortfolioValues.firstAD = ''
  lastAutofilledPortfolioValues.secondAD = ''
  lastAutofilledPortfolioValues.firstAC = ''
  lastAutofilledPortfolioValues.focusPuller = ''
  lastAutofilledPortfolioValues.editor = ''
  lastAutofilledPortfolioValues.musicDirector = ''
  lastAutofilledPortfolioValues.di = ''
  lastAutofilledPortfolioValues.cg = ''
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
      creativeHead: form.creativeHead.trim() || undefined,
      agencyHead: form.agencyHead.trim() || undefined,
      servicing: form.servicing.trim() || undefined,
      executiveProducer: form.executiveProducer.trim() || undefined,
      associateProducer: form.associateProducer.trim() || undefined,
      productionDesigner: form.productionDesigner.trim() || undefined,
      lineProducer: form.lineProducer.trim() || undefined,
      juniorProducer: form.juniorProducer.trim() || undefined,
      productionManager: form.productionManager.trim() || undefined,
      associateDirector: form.associateDirector.trim() || undefined,
      assistantDirectors: form.assistantDirectors.trim() || undefined,
      modelCoordinators: form.modelCoordinators.trim() || undefined,
      costumeStylist: form.costumeStylist.trim() || undefined,
      makeup: form.makeup.trim() || undefined,
      hair: form.hair.trim() || undefined,
      firstAD: form.firstAD.trim() || undefined,
      secondAD: form.secondAD.trim() || undefined,
      firstAC: form.firstAC.trim() || undefined,
      focusPuller: form.focusPuller.trim() || undefined,
      editor: form.editor.trim() || undefined,
      musicDirector: form.musicDirector.trim() || undefined,
      di: form.di.trim() || undefined,
      cg: form.cg.trim() || undefined,
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
      ...(form.creativeHead.trim() ? { creativeHead: form.creativeHead.trim() } : {}),
      ...(form.agencyHead.trim() ? { agencyHead: form.agencyHead.trim() } : {}),
      ...(form.servicing.trim() ? { servicing: form.servicing.trim() } : {}),
      ...(form.executiveProducer.trim() ? { executiveProducer: form.executiveProducer.trim() } : {}),
      ...(form.associateProducer.trim() ? { associateProducer: form.associateProducer.trim() } : {}),
      ...(form.productionDesigner.trim() ? { productionDesigner: form.productionDesigner.trim() } : {}),
      ...(form.lineProducer.trim() ? { lineProducer: form.lineProducer.trim() } : {}),
      ...(form.juniorProducer.trim() ? { juniorProducer: form.juniorProducer.trim() } : {}),
      ...(form.productionManager.trim() ? { productionManager: form.productionManager.trim() } : {}),
      ...(form.associateDirector.trim() ? { associateDirector: form.associateDirector.trim() } : {}),
      ...(form.assistantDirectors.trim() ? { assistantDirectors: form.assistantDirectors.trim() } : {}),
      ...(form.modelCoordinators.trim() ? { modelCoordinators: form.modelCoordinators.trim() } : {}),
      ...(form.costumeStylist.trim() ? { costumeStylist: form.costumeStylist.trim() } : {}),
      ...(form.makeup.trim() ? { makeup: form.makeup.trim() } : {}),
      ...(form.hair.trim() ? { hair: form.hair.trim() } : {}),
      ...(form.firstAD.trim() ? { firstAD: form.firstAD.trim() } : {}),
      ...(form.secondAD.trim() ? { secondAD: form.secondAD.trim() } : {}),
      ...(form.firstAC.trim() ? { firstAC: form.firstAC.trim() } : {}),
      ...(form.focusPuller.trim() ? { focusPuller: form.focusPuller.trim() } : {}),
      ...(form.editor.trim() ? { editor: form.editor.trim() } : {}),
      ...(form.musicDirector.trim() ? { musicDirector: form.musicDirector.trim() } : {}),
      ...(form.di.trim() ? { di: form.di.trim() } : {}),
      ...(form.cg.trim() ? { cg: form.cg.trim() } : {}),
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

  if (!form.creativeHead.trim() || form.creativeHead === lastAutofilledPortfolioValues.creativeHead) {
    form.creativeHead = details.creativeHead ?? ''
    lastAutofilledPortfolioValues.creativeHead = details.creativeHead ?? ''
  }

  if (!form.agencyHead.trim() || form.agencyHead === lastAutofilledPortfolioValues.agencyHead) {
    form.agencyHead = details.agencyHead ?? ''
    lastAutofilledPortfolioValues.agencyHead = details.agencyHead ?? ''
  }

  if (!form.servicing.trim() || form.servicing === lastAutofilledPortfolioValues.servicing) {
    form.servicing = details.servicing ?? ''
    lastAutofilledPortfolioValues.servicing = details.servicing ?? ''
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
    !form.productionManager.trim()
    || form.productionManager === lastAutofilledPortfolioValues.productionManager
  ) {
    form.productionManager = details.productionManager ?? ''
    lastAutofilledPortfolioValues.productionManager = details.productionManager ?? ''
  }

  if (
    !form.associateDirector.trim()
    || form.associateDirector === lastAutofilledPortfolioValues.associateDirector
  ) {
    form.associateDirector = details.associateDirector ?? ''
    lastAutofilledPortfolioValues.associateDirector = details.associateDirector ?? ''
  }

  if (
    !form.assistantDirectors.trim()
    || form.assistantDirectors === lastAutofilledPortfolioValues.assistantDirectors
  ) {
    form.assistantDirectors = details.assistantDirectors ?? ''
    lastAutofilledPortfolioValues.assistantDirectors = details.assistantDirectors ?? ''
  }

  if (
    !form.modelCoordinators.trim()
    || form.modelCoordinators === lastAutofilledPortfolioValues.modelCoordinators
  ) {
    form.modelCoordinators = details.modelCoordinators ?? ''
    lastAutofilledPortfolioValues.modelCoordinators = details.modelCoordinators ?? ''
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

  if (!form.di.trim() || form.di === lastAutofilledPortfolioValues.di) {
    form.di = details.di ?? ''
    lastAutofilledPortfolioValues.di = details.di ?? ''
  }

  if (!form.cg.trim() || form.cg === lastAutofilledPortfolioValues.cg) {
    form.cg = details.cg ?? ''
    lastAutofilledPortfolioValues.cg = details.cg ?? ''
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
      if (!value.trim()) {
        prefillStage.value = 'idle'
        prefillSummary.value = ''
      } else {
        prefillStage.value = 'error'
        prefillSummary.value = 'That does not look like a valid YouTube video URL yet.'
      }
      return
    }

    prefillStage.value = 'fetching-video'
    prefillSummary.value = 'Fetching the video title and thumbnail...'

    const timeout = setTimeout(async () => {
      const metadata = await youtubeMetadata.lookup(value)

      if (!metadata || currentRequestId !== prefillRequestId) {
        if (currentRequestId === prefillRequestId && youtubeMetadata.error.value) {
          prefillStage.value = 'error'
          prefillSummary.value = youtubeMetadata.error.value.message
        }
        return
      }

      applyYoutubeMetadata(metadata)

      if (!metadata.description.trim()) {
        prefillStage.value = 'ready'
        prefillSummary.value = 'Video details loaded. No description text was available to extract credits from.'
        return
      }

      try {
        prefillStage.value = 'extracting-details'
        prefillSummary.value = 'Reading the description and mapping likely credits...'

        const details = await convex.action(api.portfolioPrefill.prefillFromYoutubeDescription, {
          title: metadata.title,
          description: metadata.description
        }) as PortfolioPrefill

        if (currentRequestId !== prefillRequestId) {
          return
        }

        applyPortfolioPrefill(details)
        prefillStage.value = 'ready'
        prefillSummary.value = extractedFieldCount.value > 0
          ? `Video details loaded and ${extractedFieldCount.value} fields were prepared for review.`
          : 'Video details loaded. Review and fill any remaining credits manually.'
      } catch (error) {
        if (currentRequestId !== prefillRequestId) {
          return
        }

        prefillStage.value = 'error'
        prefillSummary.value = 'Video details loaded, but credit extraction could not finish.'
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
    label: 'Credits',
    icon: 'i-lucide-pen-line',
    slot: 'credits'
  },
  {
    label: 'Crew',
    icon: 'i-lucide-users',
    slot: 'crew'
  },
  {
    label: 'Post Production',
    icon: 'i-lucide-clapperboard',
    slot: 'post'
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
        <UCard class="overflow-hidden border border-default/60 bg-elevated/20">
          <div class="portfolio-modal-hero relative space-y-5">
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.24em] text-muted">
                {{ isEditMode ? 'Edit portfolio item' : 'Create portfolio item' }}
              </p>
            </div>

            <UFormField
              label="YouTube link"
              required
              description="Details will be extracted automatically using AI when you paste a YouTube video link. You can edit any of the extracted details before saving."
            >
              <div class="space-y-3">
                <UInput
                  v-model="form.videoUrl"
                  icon="i-lucide-link-2"
                  size="xl"
                  class="w-full"
                  :color="activePrefillStage === 'error' ? 'error' : undefined"
                  placeholder="https://www.youtube.com/watch?v=..."
                  :ui="{
                    base: 'transition-all duration-300',
                    trailing: 'pe-2'
                  }"
                >
                  <template #trailing>
                    <Transition name="fade-slide">
                      <div
                        v-if="activePrefillStage !== 'idle' || hasVideoUrl"
                        class="flex items-center gap-2 text-xs"
                      >
                        <UIcon
                          :name="stageMeta.icon"
                          class="h-4 w-4"
                          :class="[
                            stageMeta.tone,
                            activePrefillStage === 'fetching-video' || activePrefillStage === 'extracting-details' ? 'portfolio-spin-gentle' : ''
                          ]"
                        />
                        <span class="hidden text-muted sm:inline">{{ stageMeta.label }}</span>
                      </div>
                    </Transition>
                  </template>
                </UInput>
              </div>
            </UFormField>

            <div
              v-if="prefillSummary"
              class="rounded-2xl border border-default/60 bg-background/75 px-4 py-3 shadow-sm backdrop-blur"
            >
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UIcon
                    :name="stageMeta.icon"
                    class="h-4 w-4"
                    :class="[activePrefillStage === 'fetching-video' || activePrefillStage === 'extracting-details' ? 'portfolio-spin-gentle' : '']"
                  />
                </div>

                <div class="min-w-0 space-y-1">
                  <p class="text-sm font-medium text-highlighted">
                    {{ stageMeta.label }}
                  </p>
                  <p class="text-sm leading-6 text-muted transition-opacity duration-200">
                    {{ prefillSummary }}
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
              <div class="grid gap-4">
                <UFormField
                  label="Title"
                  required
                >
                  <UInput
                    v-model="form.title"
                    placeholder="Navarasa Show Reel 2023"
                    class="w-full"
                    @update:model-value="markTitleEdited"
                  />
                </UFormField>

                <div class="grid gap-4 grid-cols-2">
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
              </div>

              <div class="overflow-hidden rounded-[1.5rem] border border-default/60 bg-elevated/10">
                <div class="flex items-center justify-between gap-3 border-b border-default/50 px-4 py-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.24em] text-muted">
                      Preview
                    </p>
                  </div>

                  <UIcon
                    name="i-lucide-arrow-up-right"
                    class="h-4 w-4 text-muted"
                  />
                </div>

                <div class="space-y-4 p-4">
                  <div class="overflow-hidden rounded-[1.25rem] border border-default/60 bg-elevated/20 aspect-video">
                    <Transition name="fade">
                      <img
                        v-if="previewThumbnailUrl"
                        :key="previewThumbnailUrl"
                        :src="previewThumbnailUrl"
                        alt="Selected YouTube thumbnail preview"
                        class="h-full w-full object-cover"
                      >
                      <div
                        v-else
                        class="portfolio-preview-placeholder flex h-full w-full items-center justify-center"
                      >
                        <div class="flex items-center gap-2 text-sm text-muted">
                          <UIcon
                            :name="activePrefillStage === 'fetching-video' ? 'i-lucide-loader-circle' : 'i-lucide-image'"
                            class="h-4 w-4"
                            :class="[activePrefillStage === 'fetching-video' ? 'portfolio-spin-gentle' : '']"
                          />
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <div class="space-y-2">
                    <p class="text-sm font-semibold text-highlighted line-clamp-2">
                      {{ previewTitle }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <UAccordion
          type="multiple"
          :items="sections"
          :default-value="['credits']"
          :unmount-on-hide="false"
        >
          <template #credits>
            <div class="grid grid-cols-2 gap-4 pb-4">
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

              <UFormField label="Creative Head">
                <UInput
                  v-model="form.creativeHead"
                  placeholder="Creative head"
                />
              </UFormField>

              <UFormField label="Agency Head">
                <UInput
                  v-model="form.agencyHead"
                  placeholder="Agency head"
                />
              </UFormField>

              <UFormField label="Servicing">
                <UInput
                  v-model="form.servicing"
                  placeholder="Servicing team"
                />
              </UFormField>

              <UFormField label="Director">
                <UInput
                  v-model="form.director"
                  placeholder="Director name"
                />
              </UFormField>

              <UFormField label="Associate Director">
                <UInput
                  v-model="form.associateDirector"
                  placeholder="Associate director"
                />
              </UFormField>

              <UFormField label="Assistant Directors">
                <UInput
                  v-model="form.assistantDirectors"
                  placeholder="Assistant directors"
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

              <UFormField label="Production Manager">
                <UInput
                  v-model="form.productionManager"
                  placeholder="Production manager"
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

              <UFormField label="Account / Client Services">
                <UInput
                  v-model="form.account"
                  placeholder="Account team"
                />
              </UFormField>
            </div>
          </template>

          <template #crew>
            <div class="grid grid-cols-2 gap-4 pb-4">
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

              <UFormField label="Model Coordinators">
                <UInput
                  v-model="form.modelCoordinators"
                  placeholder="Model coordinators"
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
            </div>
          </template>

          <template #post>
            <div class="grid grid-cols-2 gap-4 pb-4">
              <UFormField label="Editor">
                <UInput
                  v-model="form.editor"
                  placeholder="Saumya Sharma"
                />
              </UFormField>

              <UFormField label="Assistant Editor">
                <UInput
                  v-model="form.assistantEditor"
                  placeholder="Rimnas"
                />
              </UFormField>

              <UFormField label="Music Director">
                <UInput
                  v-model="form.musicDirector"
                  placeholder="Bharat Hitarth"
                />
              </UFormField>

              <UFormField label="DI">
                <UInput
                  v-model="form.di"
                  placeholder="DI studio or artist"
                />
              </UFormField>

              <UFormField label="CG">
                <UInput
                  v-model="form.cg"
                  placeholder="CG / CGI team"
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

              <UFormField label="Post Team">
                <UInput
                  v-model="form.postTeam"
                  placeholder="Abinanth"
                />
              </UFormField>
            </div>
          </template>

          <template #publish>
            <div class="grid gap-4">
              <UFormField label="Tags">
                <UInputTags
                  v-model="form.tags"
                  placeholder="Ad film, TVC, brand film"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Description">
                <UTextarea
                  v-model="form.description"
                  :rows="4"
                  placeholder="Short description"
                  class="w-full"
                  @update:model-value="markDescriptionEdited"
                />
              </UFormField>
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Featured" description="Shows in the hero section of the homepage">
                  <USwitch v-model="form.featured" />
                </UFormField>

                <UFormField label="Published">
                  <USwitch v-model="form.published" />
                </UFormField>
              </div>

              <UFormField label="Notes">
                <UTextarea
                  v-model="form.notes"
                  :rows="4"
                  placeholder="Notes"
                  class="w-full"
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

<style scoped>


.portfolio-preview-placeholder {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
    radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary-500) 10%, transparent), transparent 40%);
}

.portfolio-spin-gentle {
  animation: portfolio-spin-gentle 1.2s linear infinite;
}

.fade-enter-active,
.fade-leave-active,
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.fade-enter-from,
.fade-leave-to,
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateY(4px);
}

@keyframes portfolio-spin-gentle {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
