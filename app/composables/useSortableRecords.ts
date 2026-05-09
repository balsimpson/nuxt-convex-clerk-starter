import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { moveRecord, sortRecords, type SortableRecord } from '~/lib/sortable'

type PersistOrder<T extends SortableRecord> = (ids: T['_id'][]) => Promise<unknown>

export function useSortableRecords<T extends SortableRecord>(
  source: MaybeRefOrGetter<readonly T[] | undefined>,
  persistOrder: PersistOrder<T>
) {
  const items = ref<T[]>([])
  const draggingId = ref<T['_id'] | null>(null)
  const dropTargetId = ref<T['_id'] | null>(null)
  const isSaving = ref(false)
  const errorMessage = ref('')

  function syncFromSource() {
    items.value = sortRecords(toValue(source) ?? []) as T[]
  }

  watch(
    () => toValue(source),
    () => {
      if (draggingId.value || isSaving.value) {
        return
      }

      syncFromSource()
    },
    { immediate: true }
  )

  async function persist(nextItems: T[]) {
    const previousItems = [...items.value]

    items.value = nextItems
    errorMessage.value = ''
    isSaving.value = true

    try {
      await persistOrder(nextItems.map(item => item._id))
    } catch (error) {
      items.value = previousItems.length ? previousItems : (sortRecords(toValue(source) ?? []) as T[])
      errorMessage.value = error instanceof Error ? error.message : 'Failed to reorder items'
    } finally {
      isSaving.value = false
    }
  }

  function reorder(fromIndex: number, toIndex: number) {
    if (isSaving.value || fromIndex === toIndex) {
      return
    }

    const next = moveRecord(items.value as T[], fromIndex, toIndex) as T[]

    void persist(next)
  }

  function reorderById(sourceId: T['_id'], targetId: T['_id']) {
    const fromIndex = items.value.findIndex(item => item._id === sourceId)
    const toIndex = items.value.findIndex(item => item._id === targetId)

    if (fromIndex === -1 || toIndex === -1) {
      return
    }

    reorder(fromIndex, toIndex)
  }

  function moveByOffset(id: T['_id'], offset: number) {
    if (isSaving.value || offset === 0) {
      return
    }

    const fromIndex = items.value.findIndex(item => item._id === id)
    const toIndex = fromIndex + offset

    if (fromIndex === -1 || toIndex < 0 || toIndex >= items.value.length) {
      return
    }

    reorder(fromIndex, toIndex)
  }

  function startDrag(id: T['_id']) {
    if (isSaving.value) {
      return
    }

    draggingId.value = id
    dropTargetId.value = id
  }

  function dragOver(id: T['_id']) {
    if (!draggingId.value || isSaving.value) {
      return
    }

    dropTargetId.value = id
  }

  function drop(id: T['_id']) {
    if (!draggingId.value) {
      return
    }

    reorderById(draggingId.value, id)
    draggingId.value = null
    dropTargetId.value = null
  }

  function endDrag() {
    draggingId.value = null
    dropTargetId.value = null
  }

  function canMoveUp(id: T['_id']) {
    return items.value.findIndex(item => item._id === id) > 0
  }

  function canMoveDown(id: T['_id']) {
    const index = items.value.findIndex(item => item._id === id)
    return index !== -1 && index < items.value.length - 1
  }

  return {
    items,
    draggingId,
    dropTargetId,
    isSaving,
    errorMessage,
    startDrag,
    dragOver,
    drop,
    endDrag,
    moveUp: (id: string) => moveByOffset(id, -1),
    moveDown: (id: string) => moveByOffset(id, 1),
    canMoveUp,
    canMoveDown
  }
}
