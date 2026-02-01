import type { GraphQLField, GraphQLInputField, GraphQLEnumValue } from 'graphql'
import type { SchemaField, SchemaEnumValue } from '../types'

export function parseFieldDirectives(
  field: GraphQLField<unknown, unknown> | GraphQLInputField,
): string[] {
  const directives: string[] = []

  if (!('astNode' in field) || !field.astNode?.directives) {
    return directives
  }

  field.astNode.directives.forEach((directive) => {
    let directiveStr = `@${directive.name.value}`

    if (directive.arguments?.length) {
      const args = directive.arguments
        .map((arg) => {
          const value = 'value' in arg.value ? (arg.value.value as string) : ''
          return `${arg.name.value}: "${value}"`
        })
        .join(', ')
      directiveStr += `(${args})`
    }

    directives.push(directiveStr)
  })

  return directives
}

export function parseDeprecated(directives: string[]): { reason: string } | undefined {
  const deprecated = directives.find((d) => d.startsWith('@deprecated'))

  if (!deprecated) {
    return undefined
  }

  const reasonMatch = deprecated.match(/@deprecated\(reason:\s*"([^"]*)"\)/)
  return {
    reason: reasonMatch ? reasonMatch[1] : '',
  }
}

export function parseField(
  field: GraphQLField<unknown, unknown> | GraphQLInputField,
): SchemaField {
  const directives = parseFieldDirectives(field)

  const result: SchemaField = {
    name: field.name,
    type: field.type.toString(),
    description: field.description || undefined,
    directives: directives.length > 0 ? directives : undefined,
    deprecated: parseDeprecated(directives),
  }

  if ('args' in field && field.args.length > 0) {
    result.args = field.args.map((arg) => ({
      name: arg.name,
      type: arg.type.toString(),
      description: arg.description || undefined,
    }))
  }

  return result
}

export function parseEnumValue(enumValue: GraphQLEnumValue): SchemaEnumValue {
  const directives: string[] = []

  if (enumValue.astNode?.directives) {
    enumValue.astNode.directives.forEach((directive) => {
      let directiveStr = `@${directive.name.value}`

      if (directive.arguments?.length) {
        const args = directive.arguments
          .map((arg) => {
            const value = 'value' in arg.value ? (arg.value.value as string) : ''
            return `${arg.name.value}: "${value}"`
          })
          .join(', ')
        directiveStr += `(${args})`
      }

      directives.push(directiveStr)
    })
  }

  return {
    name: enumValue.name,
    description: enumValue.description || undefined,
    directives: directives.length > 0 ? directives : undefined,
    deprecated: parseDeprecated(directives),
  }
}
