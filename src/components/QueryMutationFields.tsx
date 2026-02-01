import type { ReactElement } from 'react'
import type { SchemaEntity, ParsedSchema, SchemaField } from '../types'
import { FieldWithArgs } from './FieldWithArgs'

interface QueryMutationFieldsProps {
  entity: SchemaEntity
  parsed: ParsedSchema
  uuid: string
}

export function QueryMutationFields({
  entity,
  parsed,
  uuid,
}: QueryMutationFieldsProps): ReactElement {
  const virtualField: SchemaField = {
    name: entity.name,
    type: entity.fields?.[0]?.type || '',
    description: entity.description,
    args: entity.args,
    directives: entity.fields?.[0]?.directives,
    deprecated: entity.fields?.[0]?.deprecated,
  }

  return <FieldWithArgs field={virtualField} parsed={parsed} uuid={uuid} />
}
