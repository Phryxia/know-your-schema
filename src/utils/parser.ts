import {
  buildSchema,
  isObjectType,
  isInterfaceType,
  isUnionType,
  isEnumType,
  isInputObjectType,
  isScalarType,
} from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { ParsedSchema } from '../types'
import { parseField, parseEnumValue } from './parser-helpers'

export function parseGraphQLSchema(schemaContent: string): ParsedSchema {
  const schema: GraphQLSchema = buildSchema(schemaContent)

  const parsed: ParsedSchema = {
    queries: {},
    mutations: {},
    types: {},
    interfaces: {},
    unions: {},
    enums: {},
    inputs: {},
    scalars: {},
    directives: {},
  }

  const typeMap = schema.getTypeMap()

  for (const [typeName, type] of Object.entries(typeMap)) {
    if (typeName.startsWith('__')) continue

    if (isInterfaceType(type)) {
      const fields = type.getFields()
      const interfaces = type.getInterfaces().map((i) => i.name)

      parsed.interfaces[typeName] = {
        name: typeName,
        kind: 'interface',
        description: type.description || undefined,
        fields: Object.values(fields).map(parseField),
        interfaces: interfaces.length > 0 ? interfaces : undefined,
      }
    } else if (isObjectType(type)) {
      if (typeName === 'Query') {
        const fields = type.getFields()
        for (const [fieldName, field] of Object.entries(fields)) {
          const args = field.args.map((arg) => ({
            name: arg.name,
            type: arg.type.toString(),
            description: arg.description || undefined,
          }))
          parsed.queries[fieldName] = {
            name: fieldName,
            kind: 'query',
            description: field.description || undefined,
            args: args.length > 0 ? args : undefined,
            fields: [parseField(field)],
          }
        }
      } else if (typeName === 'Mutation') {
        const fields = type.getFields()
        for (const [fieldName, field] of Object.entries(fields)) {
          const args = field.args.map((arg) => ({
            name: arg.name,
            type: arg.type.toString(),
            description: arg.description || undefined,
          }))
          parsed.mutations[fieldName] = {
            name: fieldName,
            kind: 'mutation',
            description: field.description || undefined,
            args: args.length > 0 ? args : undefined,
            fields: [parseField(field)],
          }
        }
      } else {
        const fields = type.getFields()
        const interfaces = type.getInterfaces().map((i) => i.name)

        parsed.types[typeName] = {
          name: typeName,
          kind: 'type',
          description: type.description || undefined,
          fields: Object.values(fields).map(parseField),
          interfaces: interfaces.length > 0 ? interfaces : undefined,
        }
      }
    } else if (isInputObjectType(type)) {
      const fields = type.getFields()
      parsed.inputs[typeName] = {
        name: typeName,
        kind: 'input',
        description: type.description || undefined,
        fields: Object.values(fields).map(parseField),
      }
    } else if (isEnumType(type)) {
      const values = type.getValues()
      parsed.enums[typeName] = {
        name: typeName,
        kind: 'enum',
        description: type.description || undefined,
        enumValues: values.map(parseEnumValue),
      }
    } else if (isUnionType(type)) {
      const types = type.getTypes().map((t) => t.name)
      parsed.unions[typeName] = {
        name: typeName,
        kind: 'union',
        description: type.description || undefined,
        unionTypes: types,
      }
    } else if (isScalarType(type)) {
      const builtInScalars = ['String', 'Int', 'Float', 'Boolean', 'ID']
      if (!builtInScalars.includes(typeName)) {
        parsed.scalars[typeName] = {
          name: typeName,
          kind: 'scalar',
          description: type.description || undefined,
        }
      }
    }
  }

  return parsed
}
