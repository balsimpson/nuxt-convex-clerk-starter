import type { Id, TableNames } from '../_generated/dataModel'
import type { MutationCtx } from '../_generated/server'

export type SortableDocument = {
  sortOrder: number
  _creationTime: number
}

export function sortBySortOrder<T extends SortableDocument>(items: readonly T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a._creationTime - b._creationTime)
}

export async function writeSortOrder<TableName extends TableNames>(
  ctx: MutationCtx,
  ids: ReadonlyArray<Id<TableName>>
) {
  await Promise.all(ids.map((id, index) => ctx.db.patch(id, { sortOrder: index } as never)))
}
