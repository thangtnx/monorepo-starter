# @monorepo/utils

Utility functions shared across the monorepo.

## Usage

```ts
import { filterEmpty } from "@monorepo/utils"

filterEmpty([1, null, 2, undefined]) // [1, 2]
```

## Scripts

Run from the repository root with `pnpm utils <script>`.

| Script          | What it does                     |
| --------------- | -------------------------------- |
| `test`          | Run the tests (vitest)           |
| `test:coverage` | Run the tests with coverage      |
| `typecheck`     | Type check with `tsgo`           |
| `lint`          | Lint with oxlint                 |
| `quality`       | Format, lint, typecheck and test |
