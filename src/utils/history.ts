import type { EntityGroup } from '../types'

export interface VisitedEntity {
  group: EntityGroup
  name: string
}

const MAX_HISTORY = 4

function getStorageKey(uuid: string): string {
  return `history-${uuid}`
}

export function addVisit(uuid: string, group: EntityGroup, name: string): void {
  const key = getStorageKey(uuid)
  const existing = localStorage.getItem(key)
  let history: VisitedEntity[] = existing ? JSON.parse(existing) : []

  history = history.filter((item) => !(item.group === group && item.name === name))

  history.unshift({ group, name })

  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY)
  }

  localStorage.setItem(key, JSON.stringify(history))
}

export function getHistory(uuid: string): VisitedEntity[] {
  const key = getStorageKey(uuid)
  const existing = localStorage.getItem(key)
  return existing ? JSON.parse(existing) : []
}
