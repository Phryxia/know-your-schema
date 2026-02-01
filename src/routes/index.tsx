import type { ReactElement, ChangeEvent } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSchemas, useUploadSchema, useDeleteSchema } from '../hooks'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index(): ReactElement {
  const { data: schemas, isLoading } = useSchemas()
  const uploadMutation = useUploadSchema()
  const deleteMutation = useDeleteSchema()

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]
    if (file) {
      uploadMutation.mutate(file)
      event.target.value = ''
    }
  }

  function handleDelete(id: string): void {
    if (confirm('Are you sure you want to delete this schema?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <article>
      <header>
        <h1>Know Your Schema</h1>
        <p>GraphQL Schema Explorer</p>
      </header>

      <section>
        <h2>Upload Schema</h2>
        <input
          type="file"
          accept=".graphql,.gql"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
        />
        {uploadMutation.isPending && <p aria-busy="true">Uploading...</p>}
      </section>

      <section>
        <h2>Schemas</h2>
        {isLoading && <p aria-busy="true">Loading...</p>}
        {schemas && schemas.length === 0 && <p>No schemas uploaded yet.</p>}
        {schemas && schemas.length > 0 && (
          <div>
            {schemas.map((schema) => (
              <article key={schema.id}>
                <header>
                  <Link to="/schemas/$uuid" params={{ uuid: schema.id }}>
                    {schema.fileName}
                  </Link>
                </header>
                <footer>
                  <button
                    onClick={() => handleDelete(schema.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
