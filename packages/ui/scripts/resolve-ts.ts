import { registerHooks } from "node:module"

// Sources import local files without an extension, which Node's resolver
// rejects; retry those specifiers with the TypeScript file names.
const suffixes = [".ts", ".tsx", "/index.ts", "/index.tsx"]

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (!specifier.startsWith(".")) throw error

      for (const suffix of suffixes)
        try {
          return nextResolve(`${specifier}${suffix}`, context)
        } catch {}

      throw error
    }
  },
})
