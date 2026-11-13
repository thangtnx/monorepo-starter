# @monorepo/utils

Utility functions shared across the monorepo.

## Usage

```ts
import { unique } from "@monorepo/utils"
```

## Scripts

Run from the repository root with `pnpm utils <script>`.

| Script          | What it does                                  |
| --------------- | --------------------------------------------- |
| `build`         | Build ESM, CJS and type declarations (tsdown) |
| `test`          | Run the tests (vitest)                        |
| `test:coverage` | Run the tests with coverage                   |
| `typecheck`     | Type check with `tsgo`                        |
| `lint`          | Lint with oxlint                              |
| `quality`       | Format, lint, typecheck and test              |
