export type SortableRecord = {
  _id: string
  sortOrder: number
  _creationTime: number
}

export function sortRecords<T extends SortableRecord>(items: readonly T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a._creationTime - b._creationTime)
}

export function moveRecord<T>(items: readonly T[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) {
    return [...items]
  }

  const next = [...items]
  const [item] = next.splice(fromIndex, 1)

  if (!item) {
    return next
  }

  next.splice(toIndex, 0, item)
  return next
}
