# Component Rules

Follow these rules when creating a component. `<components-dir>` is the directory that holds components.

## Directory

Create one directory per component, named in kebab-case.

```text
<components-dir>/
└─ button/
   ├─ button.tsx
   ├─ button.style.ts
   ├─ button.test.tsx
   ├─ button.stories.tsx
   ├─ button-group.tsx
   ├─ namespace.ts
   └─ index.ts
```

- File names are kebab-case and start with the component name.
- `<name>.tsx` holds the component, `<name>.style.ts` its style, `<name>.test.tsx` its tests, and `<name>.stories.tsx` its stories.
- Related components in the same directory (e.g., `button-group.tsx`, `icon-button.tsx`) get their own set of files.
- `index.ts` is required. `namespace.ts` exists only for compound components.

## Component

- Use named exports. Do not use default exports.
- Add `"use client"` as the first line when the component uses state, effects, refs, or browser APIs.
- Declare props as `export interface <Name>Props`.
- Document every prop with JSDoc, and add `@default` when it has a default value.

```tsx
export interface ButtonProps {
  /**
   * If `true`, the button is disabled.
   *
   * @default false
   */
  disabled?: boolean
}
```

## Style

- Define the style in `<name>.style.ts` and import it from the component. Do not define it inside the component file.
- Export the style as `<name>Style` in camelCase (e.g., `buttonStyle`).
- Document every style prop with JSDoc and `@default`, the same as component props.

## Compound components

- Put each part in its own file and export it as `<Name><Part>` (e.g., `ButtonGroupRoot`).
- In `namespace.ts`, re-export each part under its short name (`Root`, `Item`, ...) and its props type as `<Part>Props`.

```ts
export { ButtonGroupRoot as Root } from "./button-group"
export type { ButtonGroupRootProps as RootProps } from "./button-group"
export { Button as Item } from "./button"
export type { ButtonProps as ItemProps } from "./button"
```

## index.ts

- Export style files with `export *`, components with named exports, and types with `export type`.
- Expose a compound component as a namespace with `export * as <Name> from "./namespace"`.
- It is the only barrel file in the component directory.

```ts
export * from "./button.style"
export { Button } from "./button"
export type { ButtonProps } from "./button"
export * as ButtonGroup from "./namespace"
```
