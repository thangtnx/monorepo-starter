# AGENTS.md

Guidance for AI coding agents working in this repository. See `README.md` for
setup and the full command list.

## Layout

- `packages/workspace` — private shared config (tsconfig, oxlint, oxfmt, vitest). No product code.
- `packages/utils` — utility library tested with vitest.
- `www` — web app.

## Commands

- `pnpm quality` — format check, lint, typecheck and test. Run before finishing a change.
- `pnpm utils <script>` / `pnpm workspace <script>` — run a script in a single package.
- Prefer the narrowest check first (for example `pnpm utils test`), then `pnpm quality`.

## Conventions

- TypeScript ESM only. Import local files without a file extension.
- Formatting is owned by oxfmt (no semicolons, double quotes, 80 columns). Do not hand-format.
- Add shared dependency versions to the `catalog:` in `pnpm-workspace.yaml`; reference them as `"catalog:"`.
- Internal dependencies use `workspace:*`.
- Tests live next to the source as `*.test.ts`.

## Rules

When performing one of the actions below, read the linked rule first.

- Creating branches: [Branch Rules](.agents/rules/branch.md)
- Creating commits: [Commit Rules](.agents/rules/commit.md)
- Creating components: [Component Rules](.agents/rules/component.md)
- Creating issues: [Issue Rules](.agents/rules/issue.md)
- Creating PRs: [PR Rules](.agents/rules/pr.md)

## Do not

- Commit secrets or `.env` files.
- Edit generated output (`coverage`, `.turbo`) or `pnpm-lock.yaml` by hand.
- Add a dependency for something a few lines of code can do.
