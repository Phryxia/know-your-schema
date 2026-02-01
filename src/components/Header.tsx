import type { ReactElement } from 'react'
import { Link } from '@tanstack/react-router'

export function Header(): ReactElement {
  return (
    <header className="pico container">
      <h1>
        <Link to="/">Know Your Schema</Link>
      </h1>
    </header>
  )
}
