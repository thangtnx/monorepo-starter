# Monorepo

A pnpm + Turborepo monorepo in TypeScript.

## Requirements

- Node.js `>=24.14` (see `.nvmrc`)
- pnpm `12` (the exact version is pinned in `packageManager`)

## Getting started

```bash
pnpm install
pnpm quality
```

`pnpm install` also installs the Git hooks (lefthook).

To start a new project from this starter, run `pnpm bootstrap` after installing.
It asks whether to replace the Git history before prompting for a project name.

## Structure

```text
.
├── .github/              CI workflows, composite actions, issue and PR templates
├── packages/
│   ├── workspace/        Private shared config: tsconfig, oxlint, oxfmt, vitest
│   ├── ui/               Design system: theme, generated stylesheet, components, Storybook
│   └── utils/            Utility library tested with vitest
├── www/                  Web app
├── scripts/              Repository scripts
├── lefthook.yaml         Git hooks: lint, format, commitlint
├── oxfmt.config.ts       Root formatter config (re-exports the workspace config)
├── pnpm-workspace.yaml   Workspace globs and the dependency catalog
├── turbo.json            Task pipeline and caching
└── tsconfig.json         Root TypeScript config
```

Libraries go under `packages/`; apps go in `www/`.

## Commands

Run from the repository root:

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `pnpm lint`      | Lint all packages with oxlint                         |
| `pnpm typecheck` | Type check all packages with `tsgo`                   |
| `pnpm test`      | Run all tests with vitest                             |
| `pnpm format`    | Check formatting with oxfmt (add `--write` to fix it) |
| `pnpm quality`   | Format, lint, typecheck and test in sequence          |
| `pnpm clean`     | Remove caches and `node_modules`                      |

Shortcuts to run a script inside one package: `pnpm ui <script>`,
`pnpm utils <script>` and `pnpm workspace <script>`. For example,
`pnpm ui storybook` opens the component and theme catalog.
`pnpm ui build` compiles the UI stylesheet into `packages/ui/dist/styles.css`.
`pnpm ui test:e2e` builds Storybook and runs the Playwright and axe suite against it
on Chromium, Firefox, WebKit and a mobile viewport. Install the browsers once with
`pnpm ui exec playwright install --with-deps` (on Linux, `--with-deps` installs system packages and needs sudo).

## Conventions

- Dependency versions shared across packages live in the `catalog:` section of
  `pnpm-workspace.yaml`; reference them as `"catalog:"` in `package.json`.
- Internal packages depend on each other with `workspace:*`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/),
  enforced by commitlint on `commit-msg`.
- Tool config is shared through the `workspace` package; packages extend it
  instead of redefining rules.

## CI

`.github/workflows/quality.yml` runs format, lint, typecheck and test on
pull requests and pushes to `main`. Dependabot opens weekly update PRs.
