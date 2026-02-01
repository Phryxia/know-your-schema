import type { SchemaEntity, EntityGroup } from '../../types'
import type { SearchResult } from './search'

export function checkEntityPartialMatches(
  group: Record<string, SchemaEntity>,
  groupName: EntityGroup,
  lowerKeyword: string,
  results: SearchResult[],
): void {
  for (const entity of Object.values(group)) {
    if (entity.name.toLowerCase().includes(lowerKeyword)) {
      const alreadyAdded = results.some(
        (r): boolean => r.entity.name === entity.name && r.group === groupName,
      )
      if (!alreadyAdded) {
        results.push({ entity, group: groupName, matchType: 'entity-partial' })
      }
    }
  }
}

export function checkFieldPartialMatches(
  group: Record<string, SchemaEntity>,
  groupName: EntityGroup,
  lowerKeyword: string,
  results: SearchResult[],
): void {
  for (const entity of Object.values(group)) {
    if (entity.fields) {
      for (const field of entity.fields) {
        if (field.name.toLowerCase().includes(lowerKeyword)) {
          const alreadyAdded = results.some(
            (r): boolean =>
              r.entity.name === entity.name &&
              r.group === groupName &&
              r.matchedField?.name === field.name,
          )
          if (!alreadyAdded) {
            results.push({
              entity,
              group: groupName,
              matchType: 'field-partial',
              matchedField: {
                name: field.name,
                type: field.type,
                description: field.description,
              },
            })
          }
        }
      }
    }

    if (entity.enumValues) {
      for (const value of entity.enumValues) {
        if (value.name.toLowerCase().includes(lowerKeyword)) {
          const alreadyAdded = results.some(
            (r): boolean =>
              r.entity.name === entity.name &&
              r.group === groupName &&
              r.matchedField?.name === value.name,
          )
          if (!alreadyAdded) {
            results.push({
              entity,
              group: groupName,
              matchType: 'field-partial',
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
}
