import type { ReactElement } from 'react'
import type { SchemaField, ParsedSchema } from '../types'
import { TypeLink } from './TypeLink'
import { FieldWithArgs } from './FieldWithArgs'

interface FieldListProps {
  fields: SchemaField[]
  uuid: string
  parsed: ParsedSchema
  prefix?: string
}

export function FieldList({
  fields,
  uuid,
  parsed,
  prefix = '',
}: FieldListProps): ReactElement[] {
  return fields.map((field) => {
    const fieldId = prefix ? `${prefix}-${field.name}` : field.name

    if (field.args?.length) {
      return (
        <article key={field.name} id={fieldId}>
          <h3>
            <code>
              <a href={`#${fieldId}`} data-tooltip={field.deprecated?.reason}>
                {field.deprecated ? <s>{field.name}</s> : field.name}
              </a>
            </code>
          </h3>
          {field.description && <p>{field.description}</p>}
          <FieldWithArgs field={field} parsed={parsed} uuid={uuid} />
        </article>
      )
    }

    return (
      <article key={field.name} id={fieldId}>
        {/* name */}
        <h4>
          <code>
            <a
              href={`#${fieldId}`}
              data-tooltip={field.deprecated?.reason}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
              }}
            >
              {field.deprecated ? <s>{field.name}</s> : field.name}
            </a>
          </code>
          : <TypeLink uuid={uuid} typeName={field.type} parsed={parsed} />
        </h4>

        {/* directives */}
        <p>
          {field.directives?.length &&
            !field.directives.some((d) => d.startsWith('@deprecated')) &&
            field.directives.map((directive) => (
              <span key={directive} data-tooltip={directive}>
                {' '}
                {directive}
              </span>
            ))}
        </p>

        {/* description */}
        {field.description && <p>{field.description}</p>}
      </article>
    )
  })
}
