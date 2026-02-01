import type { ReactElement } from 'react'
import { Link } from '@tanstack/react-router'
import type { ParsedSchema } from '../types'
import { isPrimitive, cleanTypeName, determineEntityGroup } from '../utils/schema'

interface TypeLinkProps {
  uuid: string
  typeName: string
  parsed: ParsedSchema
}

export function TypeLink({ uuid, typeName, parsed }: TypeLinkProps): ReactElement {
  const cleanType = cleanTypeName(typeName)

  if (isPrimitive(typeName)) {
    return (
      <em>
        <code>{typeName}</code>
      </em>
    )
  }

  const scalarEntity = parsed.scalars[cleanType]
  if (scalarEntity) {
    return (
      <em>
        <code data-tooltip={scalarEntity.description}>{typeName}</code>
      </em>
    )
  }

  const linkGroup = determineEntityGroup(cleanType, parsed)

  return (
    <em>
      <code>
        {typeName.split(/([[\]!])/).map((part, i) => {
          if (!part) {
            return null
          }

          if (part === cleanType) {
            return (
              <Link
                key={i}
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: linkGroup, name: cleanType }}
              >
                {cleanType}
              </Link>
            )
          }

          return <span key={i}>{part}</span>
        })}
      </code>
    </em>
  )
}
