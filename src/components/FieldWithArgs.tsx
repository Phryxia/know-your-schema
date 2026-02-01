import type { ReactElement } from 'react'
import { Link } from '@tanstack/react-router'
import type { ParsedSchema, SchemaField } from '../types'
import { FieldList } from './FieldList'
import { TypeLink } from './TypeLink'
import { cleanTypeName, isPrimitiveOrScalar, determineEntityGroup } from '../utils/schema'

interface FieldWithArgsProps {
  field: SchemaField
  parsed: ParsedSchema
  uuid: string
}

export function FieldWithArgs({ field, parsed, uuid }: FieldWithArgsProps): ReactElement {
  const outputTypeName = field.type
  const cleanOutput = cleanTypeName(outputTypeName)

  const outputEntity =
    parsed.types[cleanOutput] ||
    parsed.interfaces[cleanOutput] ||
    parsed.unions[cleanOutput] ||
    parsed.inputs[cleanOutput]

  const outputFields = outputEntity?.fields

  return (
    <>
      {!!field.args?.length && (
        <section>
          <h2>Input Fields</h2>
          {field.args.map((arg: SchemaField): ReactElement => {
            const cleanType = cleanTypeName(arg.type)
            const nestedEntity =
              parsed.inputs[cleanType] ||
              parsed.types[cleanType] ||
              parsed.interfaces[cleanType]

            return (
              <article key={arg.name} id={arg.name}>
                <h4>
                  <a href={`#${arg.name}`} data-tooltip={arg.deprecated?.reason}>
                    {arg.deprecated ? <s>{arg.name}</s> : arg.name}
                  </a>
                  : <TypeLink uuid={uuid} typeName={arg.type} parsed={parsed} />
                </h4>
                <p>
                  {arg.directives?.every((d) => !d.startsWith('@deprecated')) &&
                    arg.directives.map((directive) => (
                      <span key={directive} data-tooltip={directive}>
                        {' '}
                        {directive}
                      </span>
                    ))}
                </p>
                {arg.description && <p>{arg.description}</p>}

                {!isPrimitiveOrScalar(arg.type, parsed) && !!nestedEntity?.fields?.length && (
                  <FieldList fields={nestedEntity.fields} uuid={uuid} parsed={parsed} />
                )}
              </article>
            )
          })}
        </section>
      )}

      <hr />

      {!!outputFields?.length && (
        <section>
          <h2>
            Output Fields from{' '}
            <Link
              to="/schemas/$uuid/$group/$name"
              params={{
                uuid,
                group: determineEntityGroup(cleanOutput, parsed),
                name: cleanOutput,
              }}
            >
              {outputTypeName}
            </Link>
          </h2>
          <FieldList fields={outputFields} uuid={uuid} parsed={parsed} />
        </section>
      )}
    </>
  )
}
