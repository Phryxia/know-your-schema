import type { ReactElement } from 'react'
import { Link } from '@tanstack/react-router'
import type { ParsedSchema } from '../types'
import { FieldList } from './FieldList'

interface UnionPropertiesProps {
  unionTypes: string[]
  parsed: ParsedSchema
  uuid: string
}

export function UnionProperties({
  unionTypes,
  parsed,
  uuid,
}: UnionPropertiesProps): ReactElement {
  const displayedFields = new Set<string>()

  return (
    <>
      <section>
        <h2>Union Types</h2>
        <p>
          {unionTypes.map((typeName, idx) => (
            <span key={typeName}>
              {idx > 0 && ' | '}
              <Link
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: 'type', name: typeName }}
              >
                {typeName}
              </Link>
            </span>
          ))}
        </p>
      </section>

      {unionTypes.map((typeName) => {
        const typeEntity = parsed.types[typeName]
        if (!typeEntity || !typeEntity.fields || typeEntity.fields.length === 0) {
          return null
        }

        const uniqueFields = typeEntity.fields.filter((field) => {
          if (displayedFields.has(field.name)) {
            return false
          }
          displayedFields.add(field.name)
          return true
        })

        if (uniqueFields.length === 0) {
          return null
        }

        return (
          <section key={typeName}>
            <h3>
              Properties from{' '}
              <Link
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: 'type', name: typeName }}
              >
                {typeName}
              </Link>
            </h3>
            <FieldList fields={uniqueFields} uuid={uuid} parsed={parsed} prefix={typeName} />
          </section>
        )
      })}
    </>
  )
}
