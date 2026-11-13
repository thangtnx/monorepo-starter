# Commit Rules

Follow [Conventional Commits](https://www.conventionalcommits.org) for the commit message. Write commit messages in English.

**Format:** `<type>(<scope>): <description>`

- `scope` is the package or area of change (e.g., `utils`, `workspace`, `deps`). Omit it for repository-wide changes.
- `description` starts with a lowercase verb.
- Do not add trailers (such as `Co-Authored-By` or `Signed-off-by`) to the commit message.

**Examples:**

```text
fix(workspace): correct the tsconfig include globs
feat(utils): add string helpers
refactor(utils): simplify color parsing
docs: update the project structure in the readme
test(utils): cover calc edge cases
ci: add quality workflow
chore(deps): update vitest
build: update vitest config
```
