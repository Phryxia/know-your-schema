import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useParsedSchema } from '../../../hooks'
import type { SchemaEntity, EntityGroup } from '../../../types'
import { SchemaHeader } from '../../../components/SchemaHeader'
import { FieldList } from '../../../components/FieldList'
import { UnionProperties } from '../../../components/UnionProperties'
import { TypeProperties } from '../../../components/TypeProperties'
import { EnumValues } from '../../../components/EnumValues'
import { QueryMutationFields } from '../../../components/QueryMutationFields'
import { addVisit } from '../../../utils/history'

export const Route = createFileRoute('/schemas/$uuid/$group/$name')({
  component: EntityDetail,
})

function EntityDetail(): ReactElement {
  const { uuid, group, name } = Route.useParams()
  const { data: parsed, isLoading } = useParsedSchema(uuid)

  const entityGroup = group as EntityGroup

  useEffect(() => {
    if (entityGroup && name) {
      addVisit(uuid, entityGroup, name)
    }
  }, [uuid, entityGroup, name])

  if (isLoading) {
    return <article aria-busy="true">Loading...</article>
  }

  if (!parsed) {
    return <article>Schema not found</article>
  }
  let entity: SchemaEntity | undefined

  switch (entityGroup) {
    case 'query':
      entity = parsed.queries[name]
      break
    case 'mutation':
      entity = parsed.mutations[name]
      break
    case 'type':
      entity = parsed.types[name]
      break
    case 'interface':
      entity = parsed.interfaces[name]
      break
    case 'union':
      entity = parsed.unions[name]
      break
    case 'enum':
      entity = parsed.enums[name]
      break
    case 'input':
      entity = parsed.inputs[name]
      break
    case 'scalar':
      entity = parsed.scalars[name]
      break
  }

  if (!entity) {
    return <article>Entity not found</article>
  }

  return (
    <article>
      <SchemaHeader uuid={uuid} />

      <header>
        <h1>
          {entityGroup} <code>{entity.name}</code>
        </h1>
        {entity.interfaces && entity.interfaces.length > 0 && (
          <p>
            implements{' '}
            {entity.interfaces.map((iface, idx) => (
              <span key={iface}>
                {idx > 0 && ', '}
                <Link
                  to="/schemas/$uuid/$group/$name"
                  params={{ uuid, group: 'interface', name: iface }}
                >
                  {iface}
                </Link>
              </span>
            ))}
          </p>
        )}
        {entity.description && <p>{entity.description}</p>}
      </header>

      {entity.unionTypes && entity.unionTypes.length > 0 && (
        <UnionProperties unionTypes={entity.unionTypes} parsed={parsed} uuid={uuid} />
      )}

      {(entityGroup === 'query' || entityGroup === 'mutation') && (
        <QueryMutationFields entity={entity} parsed={parsed} uuid={uuid} />
      )}

      {(entityGroup === 'type' || entityGroup === 'interface') && (
        <TypeProperties entity={entity} parsed={parsed} uuid={uuid} />
      )}

      {entity.fields &&
        entity.fields.length > 0 &&
        entityGroup !== 'type' &&
        entityGroup !== 'interface' &&
        entityGroup !== 'query' &&
        entityGroup !== 'mutation' && (
          <section>
            <h2>Fields</h2>
            <FieldList fields={entity.fields} uuid={uuid} parsed={parsed} />
          </section>
        )}

      {entity.enumValues && entity.enumValues.length > 0 && (
        <EnumValues values={entity.enumValues} />
      )}
    </article>
  )
}
