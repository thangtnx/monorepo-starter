# PR Review Guidelines

Approve changes that improve the codebase once material concerns are resolved.
Keep optional polish feedback advisory. For a blocking finding, identify the
affected code, explain the impact, and state what must be resolved before merge.

## Review checklist

- **Necessity**. Does each change serve a stated requirement or fix a verified
  problem? Flag redundant behavior and abstractions without a current use.
- **Correctness**. Does the change work through its normal entry points?
  Check edge cases, failure paths, and regressions relevant to the diff.
- **Consistency**. Does the change follow nearby naming, module boundaries,
  and conventions? Reuse existing helpers and theme tokens where they fit.
- **Maintainability**. Can another contributor follow the code and verify
  its behavior? Favor straightforward control flow and clear ownership.
- **Tests**. Do existing tests cover the changed behavior, contract, or
  regression path? Ask for focused coverage when a meaningful gap remains.
  For UI changes, check the repository's component test and story conventions.
- **Accessibility**. For UI changes, check semantics, accessible names,
  keyboard operation, focus behavior, and screen-reader feedback. Verify state
  is conveyed beyond color and component tests include the accessibility check.
- **Compatibility**. Check affected package exports, component props, and
  other public contracts against existing consumers. Confirm that intentional
  breaking changes and any migration steps are stated in the PR.
- **Scope**. Check that the diff stays focused on the PR's stated outcome.
  Flag unrelated refactors, formatting churn, and generated changes.
