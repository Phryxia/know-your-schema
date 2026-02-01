export interface SchemaFile {
  id: string
  fileName: string
  content: string
  uploadedAt: number
}

export interface ParsedSchema {
  queries: Record<string, SchemaEntity>
  mutations: Record<string, SchemaEntity>
  types: Record<string, SchemaEntity>
  interfaces: Record<string, SchemaEntity>
  unions: Record<string, SchemaEntity>
  enums: Record<string, SchemaEntity>
  inputs: Record<string, SchemaEntity>
  scalars: Record<string, SchemaEntity>
  directives: Record<string, SchemaDirective>
}

export interface SchemaEntity {
  name: string
  kind: 'query' | 'mutation' | 'type' | 'interface' | 'union' | 'enum' | 'input' | 'scalar'
  description?: string
  fields?: SchemaField[]
  args?: SchemaField[]
  interfaces?: string[]
  unionTypes?: string[]
  enumValues?: SchemaEnumValue[]
}

export interface SchemaField {
  name: string
  type: string
  description?: string
  args?: SchemaField[]
  directives?: string[]
  deprecated?: {
    reason: string
  }
}

export interface SchemaEnumValue {
  name: string
  description?: string
  directives?: string[]
  deprecated?: {
    reason: string
  }
}

export interface SchemaDirective {
  name: string
  description?: string
  locations: string[]
  args?: SchemaField[]
}

export type EntityGroup =
  | 'query'
  | 'mutation'
  | 'type'
  | 'interface'
  | 'union'
  | 'enum'
  | 'input'
  | 'scalar'

export interface RecentEntity {
  group: EntityGroup
  name: string
}
