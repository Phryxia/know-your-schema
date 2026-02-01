import styles from './HeaderContents.module.css'
import classnames from 'classnames/bind'
import { Link } from '@tanstack/react-router'
import type { ReactElement } from 'react'
import { useSchema } from '../hooks'

const cx = classnames.bind(styles)

interface Props {
  uuid?: string
}

export function HeaderContents({ uuid = '' }: Props): ReactElement {
  const { data: schema } = useSchema(uuid)

  return (
    <h1 className={cx('header')}>
      <Link to="/">Know Your Schema</Link>
      {uuid && (
        <>
          <span className={cx('separator')}>&gt;</span>
          <Link to="/schemas/$uuid" params={{ uuid }}>
            {schema?.fileName || 'Loading...'}
          </Link>
        </>
      )}
      <a
        href="https://github.com/Phryxia/know-your-schema"
        className={cx('github-link')}
        target="_blank"
      >
        <img src="/logo-GitHub.svg" alt="github repository" />
      </a>
    </h1>
  )
}
