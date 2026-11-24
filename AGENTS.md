# AGENTS.md

Guidance for AI coding agents working in this repository. See `README.md` for
setup and the full command list.

## Layout

- `packages/workspace` — private shared config (tsconfig, oxlint, oxfmt, vitest). No product code.
- `packages/ui` — design system: theme, generated stylesheet, React components, Storybook.
- `packages/utils` — utility library tested with vitest.
- `www` — web app.

## Commands

- `pnpm quality` — format check, lint, typecheck and test. Run before finishing a change.
- `pnpm ui <script>` / `pnpm utils <script>` / `pnpm workspace <script>` — run a script in a single package.
- `pnpm ui build` — compile the theme and component styles into `packages/ui/dist/styles.css`.
- `pnpm ui storybook` — browse components and theme stories with live style updates. `pnpm ui build:storybook` builds the static catalog.
- `pnpm ui test:e2e` — build Storybook and run the Playwright and axe suite in `packages/ui/e2e` (Chromium, Firefox, WebKit, mobile). One-time browser install: `pnpm ui exec playwright install --with-deps` (on Linux, `--with-deps` needs sudo).
- Prefer the narrowest check first (for example `pnpm ui test`), then `pnpm quality`.

## Conventions

- TypeScript ESM only. Import local files without a file extension.
- Formatting is owned by oxfmt (no semicolons, double quotes, 80 columns). Do not hand-format.
- Add shared dependency versions to the `catalog:` in `pnpm-workspace.yaml`; reference them as `"catalog:"`.
- Internal dependencies use `workspace:*`.
- Tests live next to the source as `*.test.ts(x)`. Component tests render with `render`/`a11y` from `#test`, query by role and accessible name, and always include an `a11y` check.
- Applications load static CSS compiled at build time. Storybook compiles CSS live from the TypeScript sources. Components set `className`, `data-*` and CSS custom properties on `style`. Use `splitStyleProps` for classes and attributes, and keep stylesheet rules static. Register each new `*.style.ts` in `packages/ui/src/component-styles.ts`.
- Use theme tokens in styles. Theme definitions live in `packages/ui/src/theme/{tokens,semantic-tokens,styles}`, with a story beside each definition module.
- Every component has a story (`<name>.stories.tsx`) covering its variants, sizes and states.
- Prefer native elements (`<button>`, `<input>`, `<dialog>`, `<select>`, Popover API) for behavior and accessibility. State is never shown by color alone: pair it with text or a symbol.
- Comments explain non-obvious reasons only; no screen, plan or ticket codes.

## Rules

When performing one of the actions below, read the linked rule first.

- Creating branches: [Branch Rules](.agents/rules/branch.md)
- Creating commits: [Commit Rules](.agents/rules/commit.md)
- Running or troubleshooting Git hooks — [Pre-commit Hooks](.agents/references/pre-commit-hooks.md)
- Creating components: [Component Rules](.agents/rules/component.md)
- Creating issues: [Issue Rules](.agents/rules/issue.md)
- Creating PRs: [PR Rules](.agents/rules/pr.md)
- Reviewing PRs — [PR Review Guidelines](.agents/references/pr-review-guidelines.md)

## Do not

- Commit secrets or `.env` files.
- Edit generated output (`coverage`, `.turbo`, `storybook-static`, `packages/ui/dist`) or `pnpm-lock.yaml` by hand.
- Add a dependency for something a few lines of code can do.
