# Pre-commit Hooks

[Lefthook](../../lefthook.yaml) defines the Git hooks for this repository.

| Hook                             | Behavior                                                                                                                                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit`                     | Runs oxlint with `--type-check --max-warnings=0 --fix` on matching staged files in `packages/ui`, `packages/utils`, and `packages/workspace`. Then runs oxfmt with `--write` on matching staged files. Both steps auto-stage their fixes. |
| `commit-msg`                     | Runs commitlint on the proposed message using the [Conventional Commits configuration](../../.commitlintrc). See the [Commit Rules](../rules/commit.md) for examples.                                                                     |
| `post-merge` and `post-checkout` | Run `pnpm install --frozen-lockfile` when the configured diff from `ORIG_HEAD` to `HEAD` includes a matching `package.json` or `pnpm-lock.yaml`.                                                                                          |

## Troubleshooting

- If hooks are missing, run `pnpm exec lefthook check-install` from the
  repository root. Install dependencies with `pnpm install --frozen-lockfile`
  if the executable is unavailable, then run `pnpm exec lefthook install`.
- If lint, types, or formatting fail, fix the reported files and stage the
  intended changes. Run `pnpm exec lefthook run pre-commit` to retry on staged
  files and inspect `git diff --cached` for auto-staged fixes before committing.
- If commitlint fails, revise the message to follow the Commit Rules and retry.
- If dependencies are out of sync after a merge or checkout, run
  `pnpm install --frozen-lockfile` from the repository root. If the frozen
  install reports a mismatch, reconcile the manifests and lockfile through
  pnpm as part of the dependency change, then retry the frozen install.

Keep the hooks enabled. Fix the reported issue and retry the commit without
`--no-verify` so staged files and the commit message receive their checks.
