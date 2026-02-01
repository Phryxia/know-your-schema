import type { ReactElement } from 'react'
import { Link } from '@tanstack/react-router'
import type { SchemaEntity, ParsedSchema } from '../types'
import { FieldList } from './FieldList'

interface TypePropertiesProps {
  entity: SchemaEntity
  parsed: ParsedSchema
  uuid: string
}

export function TypeProperties({
  entity,
  parsed,
  uuid,
}: TypePropertiesProps): ReactElement | ReactElement[] | null {
  if (!entity.fields || entity.fields.length === 0) {
    return null
  }

  if (!entity.interfaces || entity.interfaces.length === 0) {
    return (
      <section>
        <h2>Fields</h2>
        <FieldList fields={entity.fields} uuid={uuid} parsed={parsed} />
      </section>
    )
  }

  const displayedFields = new Set<string>()
  const sections: ReactElement[] = []

  const ownFields = entity.fields.filter((field) => !displayedFields.has(field.name))

  if (ownFields.length > 0) {
    const entityGroup = entity.kind === 'interface' ? 'interface' : 'type'
    sections.push(
      <section key="own">
        <article>
          <header>
            <h3>
              Properties from{' '}
              <Link
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: entityGroup, name: entity.name }}
              >
                {entity.name}
              </Link>
            </h3>
          </header>
          <FieldList fields={ownFields} uuid={uuid} parsed={parsed} />
        </article>
      </section>,
    )
  }

  entity.interfaces.forEach((interfaceName) => {
    const interfaceEntity = parsed.interfaces[interfaceName]

    if (!interfaceEntity?.fields) return

    const uniqueFields = interfaceEntity.fields.filter((field) => {
      if (displayedFields.has(field.name)) {
        return false
      }
      displayedFields.add(field.name)
      return true
    })

    if (!uniqueFields.length) return

    sections.push(
      <section key={interfaceName}>
        <article>
          <header>
            <h3>
              Properties from{' '}
              <Link
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: 'interface', name: interfaceName }}
              >
                {interfaceName}
              </Link>
            </h3>
          </header>
          <FieldList fields={uniqueFields} uuid={uuid} parsed={parsed} prefix={interfaceName} />
        </article>
      </section>,
    )
  })

  return sections
}
