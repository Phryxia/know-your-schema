import type { ReactElement, ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import classNames from 'classnames'
import { useParsedSchema } from '../../hooks'
import { searchSchema } from './search'
import type { SearchResult } from './search'
import styles from './Search.module.css'

export function Search({ uuid }: { uuid: string }): ReactElement {
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const { data: parsed } = useParsedSchema(uuid)

  useEffect((): (() => void) => {
    const timer = setTimeout((): void => {
      setDebouncedKeyword(keyword)
    }, 200)

    return (): void => {
      clearTimeout(timer)
    }
  }, [keyword])

  useEffect(() => {
    if (!parsed || debouncedKeyword.length < 2) {
      setResults([])
      return
    }

    const searchResults = searchSchema(parsed, debouncedKeyword)
    setResults(searchResults.slice(0, 10))
  }, [parsed, debouncedKeyword])

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setKeyword(event.target.value)
  }

  function handleResultClick(): void {
    setKeyword('')
    setResults([])
  }

  function highlightText(text: string, keyword: string): ReactElement {
    const lowerText = text.toLowerCase()
    const lowerKeyword = keyword.toLowerCase()
    const index = lowerText.indexOf(lowerKeyword)

    if (index === -1) {
      return <>{text}</>
    }

    const before = text.substring(0, index)
    const match = text.substring(index, index + keyword.length)
    const after = text.substring(index + keyword.length)

    return (
      <>
        {before}
        <span className={styles.highlight}>{match}</span>
        {after}
      </>
    )
  }

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  function renderResult(result: SearchResult): {
    title: ReactElement
    subtitle: ReactElement | null
  } {
    const { entity, group, matchType, matchedField } = result
    const isEntityMatch = matchType === 'entity-exact' || matchType === 'entity-partial'
    const isFieldMatch = matchType === 'field-exact' || matchType === 'field-partial'
    const isDescriptionMatch = matchType === 'description'

    const title = isEntityMatch ? (
      highlightText(`${group} ${entity.name}`, debouncedKeyword)
    ) : (
      <>{`${group} ${entity.name}`}</>
    )

    let subtitle: ReactElement | null = null

    if (matchedField) {
      const fieldDisplay = matchedField.type
        ? `${matchedField.name}: ${matchedField.type}`
        : matchedField.name

      const fieldElement = isFieldMatch ? (
        highlightText(fieldDisplay, debouncedKeyword)
      ) : (
        <>{fieldDisplay}</>
      )

      if (matchedField.description) {
        const truncatedDesc = truncateText(matchedField.description, 80)
        const descElement = isDescriptionMatch ? (
          highlightText(truncatedDesc, debouncedKeyword)
        ) : (
          <>{truncatedDesc}</>
        )

        subtitle = (
          <>
            {fieldElement}
            {'\n'}
            {descElement}
          </>
        )
      } else {
        subtitle = <>{fieldElement}</>
      }
    } else if (entity.description) {
      const truncatedDesc = truncateText(entity.description, 80)
      subtitle = isDescriptionMatch ? (
        highlightText(truncatedDesc, debouncedKeyword)
      ) : (
        <>{truncatedDesc}</>
      )
    }

    return { title, subtitle }
  }

  return (
    <section>
      <input
        type="search"
        placeholder="Search entities, fields, and descriptions..."
        value={keyword}
        onChange={handleChange}
      />

      {results.length > 0 && (
        <section className={classNames(styles.results)}>
          {results.map((result, idx) => {
            const { title, subtitle } = renderResult(result)
            return (
              <article key={`${result.group}-${result.entity.name}-${idx}`}>
                <Link
                  to="/schemas/$uuid/$group/$name"
                  params={{
                    uuid,
                    group: result.group,
                    name: result.entity.name,
                  }}
                  onClick={handleResultClick}
                >
                  <strong>{title}</strong>
                </Link>
                {subtitle && (
                  <p style={{ whiteSpace: 'pre-wrap', margin: '0.5rem 0 0 0' }}>{subtitle}</p>
                )}
              </article>
            )
          })}
        </section>
      )}
    </section>
  )
}
