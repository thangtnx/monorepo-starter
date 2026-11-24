# @monorepo/ui

A design system: a theme, a stylesheet generated once from it, and React
components that only set class names and `data-*` attributes. No CSS is built
or injected at runtime.

## Usage

Run `pnpm ui build` before building an app that imports the UI package. Import
the stylesheet once at the app root, then use the components:

```tsx
import "@monorepo/ui/styles.css"
import { Button, Field, Input } from "@monorepo/ui"

export function ConsultForm() {
  return (
    <form>
      <Field required hint="We call you back within a day." label="Phone">
        <Input type="tel" />
      </Field>
      <Button type="submit">Continue</Button>
    </form>
  )
}
```

Set `data-mode="light"` or `data-mode="dark"` on `<html>` (or any section) to
force a color mode; without it the system preference applies. `colorScheme`
sets `data-scheme`, which descendants inherit.

## How styles work

- `src/theme/tokens/` holds one module per base token category. Color palettes
  come from `createPalette(hue, chroma)`.
- `src/theme/semantic-tokens/` holds color schemes, semantic colors and shadows.
  Semantic values can vary by mode using `[light, dark]` pairs.
- `src/theme/styles/` holds layer styles, text styles, reset and global styles.
- `<name>.style.ts`: `defineComponentStyle({ base, variants, sizes, props,
  defaultProps })`. Values may be bare token names for the property
  (`color: "fg.muted"`, `padding: "3"`), `{colors.border}` references,
  conditions (`_hover`, `_focusVisible`, `_disabled`, `_invalid`...), nested
  `&` selectors, `@media` keys, `layerStyle` and `textStyle`.
- `src/component-styles.ts` lists every component style. `pnpm ui build`
  compiles the theme and registered styles into the git-ignored `dist/styles.css`,
  exposed as `@monorepo/ui/styles.css`. Tests compile the same inputs directly
  and check registration, variable references and stylesheet size.

Storybook compiles CSS in its preview from the TypeScript sources and updates
it when the theme or a registered component style changes. Each theme
definition has a colocated story under **Theme**. Use the toolbar to view
the samples in light and dark mode.

## Scripts

Run from the repository root with `pnpm ui <script>`.

| Script            | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `build`           | Compile the app stylesheet into `dist/styles.css`  |
| `storybook`       | Start Storybook on port 6006                       |
| `build:storybook` | Build the static Storybook into `storybook-static` |
| `test`            | Run the tests (vitest, jsdom, axe)                 |
| `typecheck`       | Type check with `tsgo`                             |
| `lint`            | Lint with oxlint                                   |
| `quality`         | Format, lint, typecheck and test                   |
