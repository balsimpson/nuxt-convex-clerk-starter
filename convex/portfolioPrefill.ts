'use node'

import { action } from './_generated/server'
import { v } from 'convex/values'

const optionalString = v.optional(v.string())
const optionalNumber = v.optional(v.number())

type Env = {
  OPENAI_API_KEY?: string
  CONVEX_OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
}

const prefillResultValidator = v.object({
  client: optionalString,
  productionHouse: optionalString,
  creativeHead: optionalString,
  agencyHead: optionalString,
  servicing: optionalString,
  executiveProducer: optionalString,
  associateProducer: optionalString,
  productionDesigner: optionalString,
  lineProducer: optionalString,
  juniorProducer: optionalString,
  productionManager: optionalString,
  associateDirector: optionalString,
  assistantDirectors: optionalString,
  modelCoordinators: optionalString,
  costumeStylist: optionalString,
  makeup: optionalString,
  hair: optionalString,
  firstAD: optionalString,
  secondAD: optionalString,
  firstAC: optionalString,
  focusPuller: optionalString,
  editor: optionalString,
  musicDirector: optionalString,
  di: optionalString,
  cg: optionalString,
  vfx: optionalString,
  colorist: optionalString,
  soundFxAndMixing: optionalString,
  assistantEditor: optionalString,
  postTeam: optionalString,
  account: optionalString,
  category: optionalString,
  tags: v.array(v.string()),
  brand: optionalString,
  agency: optionalString,
  director: optionalString,
  dop: optionalString,
  producer: optionalString,
  year: optionalNumber,
  description: optionalString,
  notes: optionalString
})

function normalizeString(value: unknown) {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed || undefined
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map(item => normalizeString(item))
    .filter((item): item is string => Boolean(item))
    .slice(0, 12)
}

function normalizeYear(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value)
  }

  if (typeof value === 'string') {
    const parsed = Number(value.trim())

    if (Number.isFinite(parsed)) {
      return Math.trunc(parsed)
    }
  }

  return undefined
}

const prefillJsonSchema = {
  type: 'object' as const,
  strict: true,
  properties: {
    client: { type: 'string', description: 'Client company name' },
    productionHouse: { type: 'string', description: 'Production house name' },
    creativeHead: { type: 'string', description: 'Creative head' },
    agencyHead: { type: 'string', description: 'Agency head' },
    servicing: { type: 'string', description: 'Servicing team members' },
    executiveProducer: { type: 'string', description: 'Executive producer' },
    associateProducer: { type: 'string', description: 'Associate producer' },
    productionDesigner: { type: 'string', description: 'Production designer' },
    lineProducer: { type: 'string', description: 'Line producer' },
    juniorProducer: { type: 'string', description: 'Junior producer' },
    productionManager: { type: 'string', description: 'Production manager' },
    associateDirector: { type: 'string', description: 'Associate director' },
    assistantDirectors: { type: 'string', description: 'Assistant directors' },
    modelCoordinators: { type: 'string', description: 'Model coordinators' },
    costumeStylist: { type: 'string', description: 'Costume stylist' },
    makeup: { type: 'string', description: 'Makeup artist' },
    hair: { type: 'string', description: 'Hair stylist' },
    firstAD: { type: 'string', description: 'First assistant director' },
    secondAD: { type: 'string', description: 'Second assistant director' },
    firstAC: { type: 'string', description: 'First assistant camera' },
    focusPuller: { type: 'string', description: 'Focus puller' },
    editor: { type: 'string', description: 'Editor' },
    musicDirector: { type: 'string', description: 'Music director' },
    di: { type: 'string', description: 'Digital intermediate studio or artist' },
    cg: { type: 'string', description: 'CG / CGI team' },
    vfx: { type: 'string', description: 'VFX team' },
    colorist: { type: 'string', description: 'Colorist' },
    soundFxAndMixing: { type: 'string', description: 'Sound FX and mixing' },
    assistantEditor: { type: 'string', description: 'Assistant editor' },
    postTeam: { type: 'string', description: 'Post production team' },
    account: { type: 'string', description: 'Account / client services' },
    category: { type: 'string', description: 'Category: choose one of TVC, Brand Film, Corporate Film, Digital Film, Music Video, Documentary, Short Film, Feature Film, Promo, Social Media Content. If uncertain, infer from context or use the closest match.' },
    tags: { type: 'array', items: { type: 'string' }, description: 'Relevant tags' },
    brand: { type: 'string', description: 'Brand name' },
    agency: { type: 'string', description: 'Agency name' },
    director: { type: 'string', description: 'Director' },
    dop: { type: 'string', description: 'Director of photography' },
    producer: { type: 'string', description: 'Producer' },
    year: { type: 'number', description: 'Release year' },
    description: { type: 'string', description: 'Short description suitable for a portfolio card' },
    notes: { type: 'string', description: 'Any extra information that does not fit other fields' }
  },
  required: [
    'client',
    'productionHouse',
    'creativeHead',
    'agencyHead',
    'servicing',
    'executiveProducer',
    'associateProducer',
    'productionDesigner',
    'lineProducer',
    'juniorProducer',
    'productionManager',
    'associateDirector',
    'assistantDirectors',
    'modelCoordinators',
    'costumeStylist',
    'makeup',
    'hair',
    'firstAD',
    'secondAD',
    'firstAC',
    'focusPuller',
    'editor',
    'musicDirector',
    'di',
    'cg',
    'vfx',
    'colorist',
    'soundFxAndMixing',
    'assistantEditor',
    'postTeam',
    'account',
    'category',
    'tags',
    'brand',
    'agency',
    'director',
    'dop',
    'producer',
    'year',
    'description',
    'notes'
  ] as string[],
  additionalProperties: false
}

export const prefillFromYoutubeDescription = action({
  args: {
    description: v.string(),
    title: optionalString
  },
  returns: prefillResultValidator,
  handler: async (_ctx, args) => {
    const env = (globalThis as typeof globalThis & { process?: { env?: Env } }).process?.env ?? {}
    const apiKey = env.OPENAI_API_KEY ?? env.CONVEX_OPENAI_API_KEY

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    const description = args.description.trim()

    if (!description) {
      return {
        tags: []
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL ?? 'gpt-4o-mini',
        temperature: 0.2,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'portfolioPrefill',
            strict: true,
            schema: prefillJsonSchema
          }
        },
        messages: [
          {
            role: 'system',
            content: [
              'You extract portfolio form defaults from YouTube descriptions for a video production company.',
              'Return only valid JSON matching the provided schema.',
              'Use only information that is supported by the source text.',
              'Read the source carefully line by line, and prioritise explicit credit labels over loose inference.',
              'When the text contains credits in the form "Label: value", map each labeled value to the closest schema field and copy the value exactly as written.',
              'If multiple labeled credits appear in one sentence separated by commas, still treat them as separate labeled fields.',
              'If one labeled value contains multiple names, keep them together in one string in the same order as the source.',
              'Map close label variants carefully: Creative Head -> creativeHead, Agency Head -> agencyHead, Servicing -> servicing, Associate Director -> associateDirector, Assistant Director or Assistant Directors -> assistantDirectors, Model Coordinator or Model Coordinators -> modelCoordinators, Production Manager -> productionManager, DI or Digital Intermediate -> di, CG or CGI -> cg, Account or Client Services -> account, DOP or Director of Photography -> dop.',
              'Do not omit or move a clearly labeled credit into notes when a matching schema field exists.',
              'Only use notes for information that truly has no matching field.',
              'Keep description short and suitable for a portfolio card or detail page.',
              'Always generate at least 3-6 concise tags based on the content, genre, tone, industry, or notable visuals.',
              'Always infer and set a category from: TVC, Brand Film, Corporate Film, Digital Film, Music Video, Documentary, Short Film, Feature Film, Promo, or Social Media Content. Prefer explicit clues in the title or description, otherwise infer from context.',
              'Omit any other field you cannot confidently infer.',
              'Example source: "Creative Head: Prathap Suthan, Agency Head: Naresh Gupta, Servicing: Anvika Raghav and Amarpreet Singh, Model Coordinator: Anish Impulse, Mohith, DI: Aby Tad Studios, CG: Tony Magmyth, Production Manager: Sreekuttan KS"',
              'Example JSON: {"creativeHead":"Prathap Suthan","agencyHead":"Naresh Gupta","servicing":"Anvika Raghav and Amarpreet Singh","modelCoordinators":"Anish Impulse, Mohith","di":"Aby Tad Studios","cg":"Tony Magmyth","productionManager":"Sreekuttan KS","category":"TVC","tags":["automotive","action","lifestyle","cinematic"]}'
            ].join(' ')
          },
          {
            role: 'user',
            content: [
              args.title ? `Video title: ${args.title}` : null,
              'YouTube description:',
              description
            ]
              .filter(Boolean)
              .join('\n\n')
          }
        ]
      })
    })

    if (!response.ok) {
      const details = await response.text()
      throw new Error(`OpenAI request failed with status ${response.status}: ${details}`)
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null
          parsed?: Record<string, unknown> | null
        }
      }>
    }

    const parsed = payload.choices?.[0]?.message?.parsed
      ?? JSON.parse(payload.choices?.[0]?.message?.content ?? '{}') as Record<string, unknown>

    const result: {
      tags: string[]
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
      brand?: string
      agency?: string
      director?: string
      dop?: string
      producer?: string
      year?: number
      description?: string
      notes?: string
    } = {
      tags: normalizeTags(parsed.tags)
    }

    const category = normalizeString(parsed.category)
    const client = normalizeString(parsed.client)
    const productionHouse = normalizeString(parsed.productionHouse)
    const brand = normalizeString(parsed.brand)
    const agency = normalizeString(parsed.agency)
    const creativeHead = normalizeString(parsed.creativeHead)
    const agencyHead = normalizeString(parsed.agencyHead)
    const servicing = normalizeString(parsed.servicing)
    const director = normalizeString(parsed.director)
    const associateDirector = normalizeString(parsed.associateDirector)
    const assistantDirectors = normalizeString(parsed.assistantDirectors)
    const dop = normalizeString(parsed.dop)
    const producer = normalizeString(parsed.producer)
    const executiveProducer = normalizeString(parsed.executiveProducer)
    const associateProducer = normalizeString(parsed.associateProducer)
    const productionDesigner = normalizeString(parsed.productionDesigner)
    const lineProducer = normalizeString(parsed.lineProducer)
    const juniorProducer = normalizeString(parsed.juniorProducer)
    const productionManager = normalizeString(parsed.productionManager)
    const modelCoordinators = normalizeString(parsed.modelCoordinators)
    const costumeStylist = normalizeString(parsed.costumeStylist)
    const makeup = normalizeString(parsed.makeup)
    const hair = normalizeString(parsed.hair)
    const firstAD = normalizeString(parsed.firstAD)
    const secondAD = normalizeString(parsed.secondAD)
    const firstAC = normalizeString(parsed.firstAC)
    const focusPuller = normalizeString(parsed.focusPuller)
    const editor = normalizeString(parsed.editor)
    const musicDirector = normalizeString(parsed.musicDirector)
    const di = normalizeString(parsed.di)
    const cg = normalizeString(parsed.cg)
    const vfx = normalizeString(parsed.vfx)
    const colorist = normalizeString(parsed.colorist)
    const soundFxAndMixing = normalizeString(parsed.soundFxAndMixing)
    const assistantEditor = normalizeString(parsed.assistantEditor)
    const postTeam = normalizeString(parsed.postTeam)
    const account = normalizeString(parsed.account)
    const year = normalizeYear(parsed.year)
    const shortDescription = normalizeString(parsed.description)
    const notes = normalizeString(parsed.notes)

    if (category) result.category = category
    if (client) result.client = client
    if (productionHouse) result.productionHouse = productionHouse
    if (brand) result.brand = brand
    if (agency) result.agency = agency
    if (creativeHead) result.creativeHead = creativeHead
    if (agencyHead) result.agencyHead = agencyHead
    if (servicing) result.servicing = servicing
    if (director) result.director = director
    if (associateDirector) result.associateDirector = associateDirector
    if (assistantDirectors) result.assistantDirectors = assistantDirectors
    if (dop) result.dop = dop
    if (producer) result.producer = producer
    if (executiveProducer) result.executiveProducer = executiveProducer
    if (associateProducer) result.associateProducer = associateProducer
    if (productionDesigner) result.productionDesigner = productionDesigner
    if (lineProducer) result.lineProducer = lineProducer
    if (juniorProducer) result.juniorProducer = juniorProducer
    if (productionManager) result.productionManager = productionManager
    if (modelCoordinators) result.modelCoordinators = modelCoordinators
    if (costumeStylist) result.costumeStylist = costumeStylist
    if (makeup) result.makeup = makeup
    if (hair) result.hair = hair
    if (firstAD) result.firstAD = firstAD
    if (secondAD) result.secondAD = secondAD
    if (firstAC) result.firstAC = firstAC
    if (focusPuller) result.focusPuller = focusPuller
    if (editor) result.editor = editor
    if (musicDirector) result.musicDirector = musicDirector
    if (di) result.di = di
    if (cg) result.cg = cg
    if (vfx) result.vfx = vfx
    if (colorist) result.colorist = colorist
    if (soundFxAndMixing) result.soundFxAndMixing = soundFxAndMixing
    if (assistantEditor) result.assistantEditor = assistantEditor
    if (postTeam) result.postTeam = postTeam
    if (account) result.account = account
    if (year !== undefined) result.year = year
    if (shortDescription) result.description = shortDescription
    if (notes) result.notes = notes

    return result
  }
})
