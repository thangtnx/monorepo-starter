// Run from the repository root after cloning, before or after pnpm install.
// Offers to turn the clone into a new project: asks for a name, renames the
// `@monorepo/*` packages and the root package, resets the git history and
// reinstalls so the workspace links use the new names.
// The answer is stored in .git/starter-bootstrap-done so the question is asked
// only once. Skipped when CI is set or no input is available.
// After a rename the script removes itself and its README section.
import { execFileSync, execSync } from "node:child_process"
import { existsSync, lstatSync } from "node:fs"
import { readdir, readFile, rm, rmdir, writeFile } from "node:fs/promises"
import { basename, dirname, join, resolve } from "node:path"
import { createInterface } from "node:readline"

const gitDir = ".git"
const marker = ".git/starter-bootstrap-done"
const oldRoot = "monorepo-starter"
const oldScope = "@monorepo/"
const namePattern = /^[a-z0-9][a-z0-9-]*$/
const textFile = /\.(json|md|mjs|mts|cts|ts|tsx|ya?ml)$/
const skipDirs = new Set([
  ".git",
  ".pnpm-store",
  ".turbo",
  ".worktrees",
  "node_modules",
  "dist",
  "coverage",
])
const self = resolve(import.meta.filename)

process.chdir(resolve(dirname(self), ".."))

if (!existsSync(gitDir) || existsSync(marker) || process.env.CI) process.exit(0)

if (!lstatSync(gitDir).isDirectory()) {
  console.error("Run bootstrap from a standalone Git clone.")
  process.exit(1)
}

const rl = createInterface({ input: process.stdin })
const lines = rl[Symbol.asyncIterator]()

/** Returns the typed line, or null when no more input is available. */
async function ask(prompt) {
  process.stdout.write(prompt)
  const { done, value } = await lines.next()
  return done ? null : value
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue

    const path = join(dir, entry.name)

    if (entry.isDirectory()) yield* walk(path)
    else if (
      entry.isFile() &&
      entry.name !== "pnpm-lock.yaml" &&
      textFile.test(entry.name) &&
      resolve(path) !== self
    ) {
      yield path
    }
  }
}

async function rename(name) {
  for await (const path of walk(".")) {
    const text = await readFile(path, "utf8")
    const next = text.replaceAll(oldScope, `@${name}/`)

    if (next !== text) await writeFile(path, next)
  }

  const pkg = await readFile("package.json", "utf8")
  await writeFile(
    "package.json",
    pkg.replace(`"name": "${oldRoot}"`, `"name": "${name}"`),
  )
}

async function removeSelf() {
  const readme = await readFile("README.md", "utf8").catch(() => null)

  if (readme !== null)
    await writeFile(
      "README.md",
      readme
        .replace(/^### Bootstrap a new project\n[\s\S]*?(?=^## )/m, "")
        .replace(/^.*scripts\/.*Repository scripts.*\n/m, ""),
    )

  await rm(self)
  await rmdir(dirname(self)).catch(() => {})
}

const answer = await ask(
  "Start your own project? The current git history will be deleted and git will be re-initialized. [y/N] ",
)

// No interactive input: skip without the marker, so the question is asked again next time.
if (answer === null) process.exit(0)

if (/^y(es)?$/i.test(answer.trim())) {
  const fallback = basename(process.cwd())
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  let name = ""

  while (!name) {
    const value = await ask(
      `Project name (used as the package name and the @<name> scope) [${fallback}]: `,
    )

    if (value === null) process.exit(0)

    const candidate = value.trim() || fallback

    if (namePattern.test(candidate)) name = candidate
    else console.log("Use only lowercase letters, numbers, and hyphens.")
  }

  execSync("pnpm --version", { stdio: "ignore" })
  await rename(name)
  await rm(gitDir, { recursive: true, maxRetries: 3 })
  execFileSync("git", ["init"], { stdio: "inherit" })
  rl.close()
  console.log(
    `Renamed packages to @${name}/* and initialized a new git repository.`,
  )
  execSync("pnpm install --no-frozen-lockfile", { stdio: "inherit" })
  await writeFile(marker, new Date().toISOString())
  await removeSelf()
} else {
  rl.close()
  await writeFile(marker, new Date().toISOString())
  console.log("Keeping the current git history.")
}
