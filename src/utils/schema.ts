import type { ParsedSchema, EntityGroup } from '../types'

export function isPrimitive(typeName: string): boolean {
  const primitives = ['String', 'Int', 'Float', 'Boolean', 'ID']
  return primitives.includes(cleanTypeName(typeName))
}

export function isPrimitiveOrScalar(typeName: string, parsed: ParsedSchema): boolean {
  const cleanName = cleanTypeName(typeName)
  return isPrimitive(typeName) || !!parsed.scalars[cleanName]
}

export function determineEntityGroup(cleanType: string, parsed: ParsedSchema): EntityGroup {
  if (parsed.interfaces[cleanType]) {
    return 'interface'
  }
  if (parsed.unions[cleanType]) {
    return 'union'
  }
  if (parsed.inputs[cleanType]) {
    return 'input'
  }
  return 'type'
}

export function cleanTypeName(typeName: string): string {
  return typeName.replace(/[\[\]!]/g, '')
}
