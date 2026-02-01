import type { SchemaEntity, EntityGroup } from '../../types'
import type { SearchResult } from './search'

export function checkEntityExactMatches(
  group: Record<string, SchemaEntity>,
  groupName: EntityGroup,
  lowerKeyword: string,
  results: SearchResult[],
): void {
  for (const entity of Object.values(group)) {
    if (entity.name.toLowerCase() === lowerKeyword) {
      results.push({ entity, group: groupName, matchType: 'entity-exact' })
    }
  }
}

export function checkFieldExactMatches(
  group: Record<string, SchemaEntity>,
  groupName: EntityGroup,
  lowerKeyword: string,
  results: SearchResult[],
): void {
  for (const entity of Object.values(group)) {
    if (entity.fields) {
      for (const field of entity.fields) {
        if (field.name.toLowerCase() === lowerKeyword) {
          results.push({
            entity,
            group: groupName,
            matchType: 'field-exact',
            matchedField: {
              name: field.name,
              type: field.type,
              description: field.description,
            },
          })
        }
      }
    }

    if (entity.enumValues) {
      for (const value of entity.enumValues) {
        if (value.name.toLowerCase() === lowerKeyword) {
          results.push({
            entity,
            group: groupName,
            matchType: 'field-exact',
            matchedField: {
              name: value.name,
              type: '',
              description: value.description,
            },
          })
        }
      }
    }
  }
}
