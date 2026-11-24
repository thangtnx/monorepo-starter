import type { ReactNode } from "react"

interface StackProps<Row extends string> {
  rows: readonly Row[]
  variant: "stack"
  children: (row: Row) => ReactNode
}

interface GridProps<Row extends string, Column extends string> {
  columns: readonly Column[]
  rows: readonly Row[]
  children: (row: Row, column: Column) => ReactNode
  variant?: "grid"
}

export function PropsTable<Row extends string, Column extends string>(
  props: GridProps<Row, Column> | StackProps<Row>,
) {
  return (
    // cspell:ignore noninteractive
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable container must be keyboard-focusable
    <div className="sb-props-table" tabIndex={0}>
      <table
        className={props.variant === "stack" ? "sb-props-stack" : undefined}
      >
        {props.variant !== "stack" && (
          <thead>
            <tr>
              <td aria-hidden="true" />
              {props.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {props.rows.map((row) => (
            <tr key={row}>
              <th scope="row">{row}</th>
              {props.variant === "stack" ? (
                <td>{props.children(row)}</td>
              ) : (
                props.columns.map((column) => (
                  <td key={column}>
                    <div className="sb-props-cell">
                      {props.children(row, column)}
                    </div>
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function keys<T extends object>(record: T) {
  return Object.keys(record) as Extract<keyof T, string>[]
}
