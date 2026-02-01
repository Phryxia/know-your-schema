import type { SchemaEntity, EntityGroup } from '../../types'
import type { SearchResult } from './search'

export function checkDescriptionMatches(
  group: Record<string, SchemaEntity>,
  groupName: EntityGroup,
  lowerKeyword: string,
  results: SearchResult[],
): void {
  for (const entity of Object.values(group)) {
    if (entity.description?.toLowerCase().includes(lowerKeyword)) {
      const alreadyAdded = results.some(
        (r): boolean => r.entity.name === entity.name && r.group === groupName,
      )
      if (!alreadyAdded) {
        results.push({ entity, group: groupName, matchType: 'description' })
      }
    }

    if (entity.fields) {
      for (const field of entity.fields) {
        if (field.description?.toLowerCase().includes(lowerKeyword)) {
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
              matchType: 'description',
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
        if (value.description?.toLowerCase().includes(lowerKeyword)) {
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
              matchType: 'description',
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
