// Run explicitly with `pnpm bootstrap` after installing dependencies.
// Offers to turn the clone into a new project: asks for a name, renames the
// `@monorepo/*` packages and the root package, resets the git history and
// reinstalls so the workspace links use the new names.
// Skipped in CI; requires an interactive terminal.
// After a rename it removes itself, its package script and its README instructions.
import { execFileSync, execSync } from "node:child_process"
import { existsSync } from "node:fs"
import { readdir, readFile, rmdir, writeFile } from "node:fs/promises"
import { basename, dirname, join, resolve } from "node:path"
import { createInterface } from "node:readline"
import { rimraf } from "rimraf"

const gitDir = ".git"
const oldRoot = "monorepo-starter"
const oldScope = "@monorepo/"
const namePattern = /^[a-z0-9][a-z0-9-]*$/
const textFile = /\.(json|md|mjs|mts|cts|ts|tsx|ya?ml)$/
const skipDirs = new Set([".git", ".turbo", "node_modules", "dist", "coverage"])
const self = resolve(import.meta.filename)

if (!existsSync(gitDir) || process.env.CI) process.exit(0)

if (!process.stdin.isTTY) {
  console.error("Run pnpm bootstrap from an interactive terminal.")
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
    else if (textFile.test(entry.name) && resolve(path) !== self) yield path
  }
}

async function rename(name) {
  for await (const path of walk(".")) {
    const text = await readFile(path, "utf8")
    const next = text
      .replaceAll(oldScope, `@${name}/`)
      .replaceAll(oldRoot, name)

    if (next !== text) await writeFile(path, next)
  }
}

async function removeSelf() {
  const pkg = await readFile("package.json", "utf8")

  await writeFile(
    "package.json",
    pkg.replace(/^.*"bootstrap": "node scripts\/bootstrap\.mjs",\r?\n/m, ""),
  )

  const readme = await readFile("README.md", "utf8").catch(() => null)

  if (readme !== null)
    await writeFile(
      "README.md",
      readme.replace(
        /^To start a new project from this starter,[\s\S]*?\r?\n\r?\n/m,
        "",
      ),
    )

  await rimraf(self)
  await rmdir(dirname(self)).catch(() => {})
}

const answer = await ask(
  "Start your own project? The current git history will be deleted and git will be re-initialized. [y/N] ",
)

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

  await rename(name)
  await rimraf(gitDir)
  execFileSync("git", ["init", "--initial-branch=main"], { stdio: "inherit" })
  execFileSync("git", ["config", "--local", "core.autocrlf", "false"], {
    stdio: "inherit",
  })
  rl.close()
  console.log(
    `Renamed packages to @${name}/* and initialized a new git repository.`,
  )
  execSync("pnpm install", { stdio: "inherit" })
  await removeSelf()
  execFileSync("git", ["add", "-A"], { stdio: "inherit" })
  execFileSync("git", ["commit", "-m", "chore: initial commit"], {
    stdio: "inherit",
  })
} else {
  rl.close()
  console.log("Keeping the current git history.")
}
