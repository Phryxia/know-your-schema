import type { ReactElement } from 'react'
import { Link } from '@tanstack/react-router'
import type { EntityGroup } from '../types'

interface EntityListProps {
  title: string
  entities: string[]
  uuid: string
  group?: EntityGroup
  groupResolver?: (name: string) => EntityGroup
  limit: number
  onLoadMore: () => void
}

export function EntityList({
  title,
  entities,
  uuid,
  group,
  groupResolver,
  limit,
  onLoadMore,
}: EntityListProps): ReactElement | null {
  if (entities.length === 0) return null

  function getGroup(name: string): EntityGroup {
    if (groupResolver) {
      return groupResolver(name)
    }
    if (group) {
      return group
    }
    throw new Error('Either group or groupResolver must be provided')
  }

  return (
    <section>
      <h2>{title}</h2>
      <p>
        {entities.slice(0, limit).map((name, idx) => {
          const entityGroup = getGroup(name)
          return (
            <em key={name}>
              {idx > 0 && ' '}
              <Link
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: entityGroup, name }}
              >
                {name}
              </Link>
            </em>
          )
        })}

        {/* more */}
        {entities.length > limit && (
          <>
            {' '}
            <a
              href="#"
              onClick={(e): void => {
                e.preventDefault()
                onLoadMore()
              }}
            >
              ...more
            </a>
          </>
        )}
      </p>

      <hr />
    </section>
  )
}
