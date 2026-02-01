import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { getAllSchemas, getSchemaById, saveSchema, deleteSchema } from './utils/db'
import { parseGraphQLSchema } from './utils/parser'
import type { SchemaFile, ParsedSchema } from './types'

export function useSchemas(): UseQueryResult<SchemaFile[], Error> {
  return useQuery({
    queryKey: ['schemas'],
    queryFn: getAllSchemas,
  })
}

export function useSchema(id: string): UseQueryResult<SchemaFile | null, Error> {
  return useQuery({
    queryKey: ['schema', id],
    queryFn: (): Promise<SchemaFile | null> => getSchemaById(id),
    enabled: !!id,
  })
}

export function useParsedSchema(id: string): UseQueryResult<ParsedSchema | null, Error> {
  return useQuery({
    queryKey: ['parsed-schema', id],
    queryFn: async (): Promise<ParsedSchema | null> => {
      const schema = await getSchemaById(id)
      if (!schema) return null
      return parseGraphQLSchema(schema.content)
    },
    enabled: !!id,
  })
}

export function useUploadSchema(): UseMutationResult<string, Error, File, unknown> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const content = await file.text()
      return saveSchema(file.name, content)
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] })
    },
  })
}

export function useDeleteSchema(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSchema,
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] })
    },
  })
}
