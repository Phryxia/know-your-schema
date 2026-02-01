import type { ReactElement } from 'react'
import type { SchemaEnumValue } from '../types'

interface EnumValuesProps {
  values: SchemaEnumValue[]
}

export function EnumValues({ values }: EnumValuesProps): ReactElement {
  return (
    <section>
      <h2>Values</h2>
      {values.map((value) => (
        <div key={value.name} id={value.name}>
          <p>
            <a href={`#${value.name}`}>{value.deprecated ? <s>{value.name}</s> : value.name}</a>
            {value.directives &&
              value.directives.length > 0 &&
              !value.directives.some((d) => d.startsWith('@deprecated')) &&
              value.directives.map((directive) => (
                <span key={directive} title={directive}>
                  {' '}
                  {directive}
                </span>
              ))}
          </p>
          {value.description && <p>{value.description}</p>}
        </div>
      ))}
    </section>
  )
}
