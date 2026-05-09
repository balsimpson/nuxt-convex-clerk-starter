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
  executiveProducer: optionalString,
  associateProducer: optionalString,
  productionDesigner: optionalString,
  lineProducer: optionalString,
  juniorProducer: optionalString,
  costumeStylist: optionalString,
  makeup: optionalString,
  hair: optionalString,
  firstAD: optionalString,
  secondAD: optionalString,
  firstAC: optionalString,
  focusPuller: optionalString,
  editor: optionalString,
  musicDirector: optionalString,
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

function parseJsonObject(content: string) {
  const trimmed = content.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  const candidate = fenced?.[1]?.trim() ?? trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  const jsonText = start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate

  return JSON.parse(jsonText) as Record<string, unknown>
}

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
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              'You extract portfolio form defaults from YouTube descriptions for a video production company.',
              'Return only valid JSON with these keys: client, productionHouse, brand, agency, director, dop, producer, executiveProducer, associateProducer, productionDesigner, lineProducer, juniorProducer, costumeStylist, makeup, hair, firstAD, secondAD, firstAC, focusPuller, editor, musicDirector, vfx, colorist, soundFxAndMixing, assistantEditor, postTeam, account, category, tags, year, description, notes.',
              'Use only information that is supported by the source text.',
              'Keep combined credit lines intact as a single string when the source combines multiple names.',
              'Put information that does not fit the portfolio schema into notes.',
              'Keep description short and suitable for a portfolio card or detail page.',
              'Use concise tags, and omit any field you cannot confidently infer.'
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
        }
      }>
    }

    const content = payload.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('OpenAI response did not include any content')
    }

    const parsed = parseJsonObject(content)

    const result: {
      tags: string[]
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
    const director = normalizeString(parsed.director)
    const dop = normalizeString(parsed.dop)
    const producer = normalizeString(parsed.producer)
    const executiveProducer = normalizeString(parsed.executiveProducer)
    const associateProducer = normalizeString(parsed.associateProducer)
    const productionDesigner = normalizeString(parsed.productionDesigner)
    const lineProducer = normalizeString(parsed.lineProducer)
    const juniorProducer = normalizeString(parsed.juniorProducer)
    const costumeStylist = normalizeString(parsed.costumeStylist)
    const makeup = normalizeString(parsed.makeup)
    const hair = normalizeString(parsed.hair)
    const firstAD = normalizeString(parsed.firstAD)
    const secondAD = normalizeString(parsed.secondAD)
    const firstAC = normalizeString(parsed.firstAC)
    const focusPuller = normalizeString(parsed.focusPuller)
    const editor = normalizeString(parsed.editor)
    const musicDirector = normalizeString(parsed.musicDirector)
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
    if (director) result.director = director
    if (dop) result.dop = dop
    if (producer) result.producer = producer
    if (executiveProducer) result.executiveProducer = executiveProducer
    if (associateProducer) result.associateProducer = associateProducer
    if (productionDesigner) result.productionDesigner = productionDesigner
    if (lineProducer) result.lineProducer = lineProducer
    if (juniorProducer) result.juniorProducer = juniorProducer
    if (costumeStylist) result.costumeStylist = costumeStylist
    if (makeup) result.makeup = makeup
    if (hair) result.hair = hair
    if (firstAD) result.firstAD = firstAD
    if (secondAD) result.secondAD = secondAD
    if (firstAC) result.firstAC = firstAC
    if (focusPuller) result.focusPuller = focusPuller
    if (editor) result.editor = editor
    if (musicDirector) result.musicDirector = musicDirector
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
