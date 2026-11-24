# Branch Rules

Use `<type>/<kebab-case>` for branch names.

- `type` matches the [Commit Rules](./commit.md) types (`feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `ci`, `build`, `perf`, `style`).
- The kebab-case part briefly identifies the scope or area (package, module, topic).

## Before editing

Before editing any component or feature, create a new branch from `develop`.
Use `main` only if `develop` is absent. Never edit components or features
directly on `main` or `develop`.

1. Run `git status --short` and confirm the working tree and index are clean,
   including untracked files. Resolve any existing work before branching.
2. Check that the proposed name is unused. Run
   `git branch --list <branch-name>` and
   `git branch --remotes --list "*/<branch-name>"` to check local and
   remote-tracking branches. Refresh remote refs if they may be stale.
3. Run `git switch -c <branch-name> develop`, substituting `main` only when
   `develop` is absent.

## Examples

```text
feat/add-string-helpers
fix/workspace-tsconfig-include
docs/readme-structure
refactor/color-parsing
build/dependencies
```
