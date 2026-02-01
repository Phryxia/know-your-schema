import type { ReactElement } from 'react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSchema, useParsedSchema } from '../../hooks'
import { SchemaHeader } from '../../components/SchemaHeader'
import { EntityList } from '../../components/EntityList'
import type { EntityGroup } from '../../types'

export const Route = createFileRoute('/schemas/$uuid/')({
  component: SchemaDetail,
})

function SchemaDetail(): ReactElement {
  const { uuid } = Route.useParams()
  const { data: schema } = useSchema(uuid)
  const { data: parsed, isLoading } = useParsedSchema(uuid)

  const [queryLimit, setQueryLimit] = useState(10)
  const [mutationLimit, setMutationLimit] = useState(10)
  const [interfaceLimit, setInterfaceLimit] = useState(10)
  const [typeUnionLimit, setTypeUnionLimit] = useState(10)
  const [enumLimit, setEnumLimit] = useState(10)
  const [inputLimit, setInputLimit] = useState(10)
  const [scalarLimit, setScalarLimit] = useState(10)

  if (isLoading) {
    return <article aria-busy="true">Loading...</article>
  }

  if (!schema || !parsed) {
    return <article>Schema not found</article>
  }

  const queries = Object.keys(parsed.queries).sort()
  const mutations = Object.keys(parsed.mutations).sort()
  const types = Object.keys(parsed.types).sort()
  const interfaces = Object.keys(parsed.interfaces).sort()
  const unions = Object.keys(parsed.unions).sort()
  const typesAndUnions = [...types, ...unions].sort()
  const enums = Object.keys(parsed.enums).sort()
  const inputs = Object.keys(parsed.inputs).sort()
  const scalars = Object.keys(parsed.scalars).sort()

  return (
    <article>
      <SchemaHeader uuid={uuid} />

      <EntityList
        title="Queries"
        entities={queries}
        uuid={uuid}
        group="query"
        limit={queryLimit}
        onLoadMore={(): void => setQueryLimit(queryLimit + 10)}
      />

      <EntityList
        title="Mutations"
        entities={mutations}
        uuid={uuid}
        group="mutation"
        limit={mutationLimit}
        onLoadMore={(): void => setMutationLimit(mutationLimit + 10)}
      />

      <EntityList
        title="Interfaces"
        entities={interfaces}
        uuid={uuid}
        group="interface"
        limit={interfaceLimit}
        onLoadMore={(): void => setInterfaceLimit(interfaceLimit + 10)}
      />

      <EntityList
        title="Types & Unions"
        entities={typesAndUnions}
        uuid={uuid}
        groupResolver={(name: string): EntityGroup =>
          unions.includes(name) ? 'union' : 'type'
        }
        limit={typeUnionLimit}
        onLoadMore={(): void => setTypeUnionLimit(typeUnionLimit + 10)}
      />

      <EntityList
        title="Enums"
        entities={enums}
        uuid={uuid}
        group="enum"
        limit={enumLimit}
        onLoadMore={(): void => setEnumLimit(enumLimit + 10)}
      />

      <EntityList
        title="Input Types"
        entities={inputs}
        uuid={uuid}
        group="input"
        limit={inputLimit}
        onLoadMore={(): void => setInputLimit(inputLimit + 10)}
      />

      <EntityList
        title="Scalars"
        entities={scalars}
        uuid={uuid}
        group="scalar"
        limit={scalarLimit}
        onLoadMore={(): void => setScalarLimit(scalarLimit + 10)}
      />
    </article>
  )
}
