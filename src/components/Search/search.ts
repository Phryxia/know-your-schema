import type { ParsedSchema, SchemaEntity, EntityGroup } from '../../types'
import { checkEntityExactMatches, checkFieldExactMatches } from './search-exact'
import { checkEntityPartialMatches, checkFieldPartialMatches } from './search-partial'
import { checkDescriptionMatches } from './search-description'

export interface SearchResult {
  entity: SchemaEntity
  group: EntityGroup
  matchType: 'entity-exact' | 'field-exact' | 'entity-partial' | 'field-partial' | 'description'
  matchedField?: {
    name: string
    type: string
    description?: string
  }
}

export function searchSchema(parsed: ParsedSchema, keyword: string): SearchResult[] {
  if (keyword.length < 2) return []

  const results: SearchResult[] = []
  const lowerKeyword = keyword.toLowerCase()

  const groups: Array<[Record<string, SchemaEntity>, EntityGroup]> = [
    [parsed.queries, 'query'],
    [parsed.mutations, 'mutation'],
    [parsed.types, 'type'],
    [parsed.interfaces, 'interface'],
    [parsed.unions, 'union'],
    [parsed.enums, 'enum'],
    [parsed.inputs, 'input'],
    [parsed.scalars, 'scalar'],
  ]

  for (const [group, groupName] of groups) {
    checkEntityExactMatches(group, groupName, lowerKeyword, results)
  }

  for (const [group, groupName] of groups) {
    checkFieldExactMatches(group, groupName, lowerKeyword, results)
  }

  for (const [group, groupName] of groups) {
    checkEntityPartialMatches(group, groupName, lowerKeyword, results)
  }

  for (const [group, groupName] of groups) {
    checkFieldPartialMatches(group, groupName, lowerKeyword, results)
  }

  for (const [group, groupName] of groups) {
    checkDescriptionMatches(group, groupName, lowerKeyword, results)
  }

  return results
}
