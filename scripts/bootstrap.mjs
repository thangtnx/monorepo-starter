// Runs once after the repository is cloned (through the `prepare` script).
// Offers to turn the clone into a new project: asks for a name, renames the
// `@monorepo/*` packages and the root package, resets the git history and
// reinstalls so the workspace links use the new names.
// The answer is stored in .git/starter-bootstrap-done so the question is asked
// only once. Skipped when CI is set or no input is available.
import { execFileSync, execSync } from "node:child_process"
import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import { basename, join, resolve } from "node:path"
import { createInterface } from "node:readline"
import { rimraf } from "rimraf"

const gitDir = ".git"
const marker = ".git/starter-bootstrap-done"
const oldRoot = "monorepo-starter"
const oldScope = "@monorepo/"
const namePattern = /^[a-z0-9][a-z0-9-]*$/
const textFile = /\.(json|md|mjs|mts|cts|ts|tsx|ya?ml)$/
const skipDirs = new Set([".git", ".turbo", "node_modules", "dist", "coverage"])
const self = resolve(import.meta.filename)

if (!existsSync(gitDir) || existsSync(marker) || process.env.CI) process.exit(0)

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

const answer = await ask(
  "Bạn có muốn bắt đầu dự án riêng? Lịch sử git hiện tại sẽ bị xoá và git được khởi tạo lại. [y/N] ",
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
      `Tên dự án (dùng làm tên package và scope @<tên>) [${fallback}]: `,
    )

    if (value === null) process.exit(0)

    const candidate = value.trim() || fallback

    if (namePattern.test(candidate)) name = candidate
    else console.log("Tên chỉ gồm chữ thường, số và dấu gạch ngang.")
  }

  await rename(name)
  await rimraf(gitDir)
  execFileSync("git", ["init"], { stdio: "inherit" })
  rl.close()
  // The marker must exist before the nested install so its `prepare` run exits early.
  await writeFile(marker, new Date().toISOString())
  console.log(`Đã đổi tên package thành @${name}/* và khởi tạo git mới.`)
  execSync("pnpm install --ignore-scripts", { stdio: "inherit" })
} else {
  rl.close()
  await writeFile(marker, new Date().toISOString())
  console.log("Giữ nguyên lịch sử git hiện tại.")
}
