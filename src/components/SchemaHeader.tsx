import type { ReactElement } from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Search } from './Search'
import { getHistory } from '../utils/history'
import type { VisitedEntity } from '../utils/history'
import { HeaderContents } from './HeaderContents'

interface SchemaHeaderProps {
  uuid: string
}

export function SchemaHeader({ uuid }: SchemaHeaderProps): ReactElement {
  const location = useLocation()
  const [history, setHistory] = useState<VisitedEntity[]>([])

  useEffect(() => {
    const currentHistory = getHistory(uuid)
    setHistory(currentHistory)
  }, [uuid, location.pathname])

  return (
    <header className="pico container">
      <HeaderContents uuid={uuid} />

      <Search uuid={uuid} />

      {history.length > 0 && (
        <nav>
          <strong>Recently Visited</strong>{' '}
          {history.map((item, idx) => (
            <span key={`${item.group}-${item.name}-${idx}`}>
              {idx > 0 && ' '}
              <Link
                to="/schemas/$uuid/$group/$name"
                params={{ uuid, group: item.group, name: item.name }}
              >
                {item.group} {item.name}
              </Link>
            </span>
          ))}
        </nav>
      )}
    </header>
  )
}
