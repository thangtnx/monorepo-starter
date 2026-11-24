import type { Ref, RefCallback } from "react"
import type { CompoundValue } from "./types"
import { cx } from "@monorepo/utils"

export { cx }

export function dataAttr(value: CompoundValue): string
export function dataAttr(
  value: CompoundValue | null | undefined,
): string | undefined
export function dataAttr(value: CompoundValue | null | undefined) {
  return value == null ? undefined : String(value)
}

export function mergeRefs<T>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> | undefined {
  const active = refs.filter((ref) => ref != null)
  if (active.length === 0) return undefined
  if (active.length === 1 && typeof active[0] === "function") return active[0]

  return (node) => {
    const cleanups = active.map((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(node)
        return typeof cleanup === "function"
          ? cleanup
          : () => {
              ref(null)
            }
      }
      ref.current = node
      return () => {
        ref.current = null
      }
    })

    if (node !== null)
      return () => {
        for (const cleanup of cleanups) cleanup()
      }
  }
}

type MergeValue<Key, Previous, Next> = Next extends undefined
  ? Previous
  : Key extends "ref"
    ? Next extends null
      ? Previous extends undefined
        ? Next
        : Previous
      : Previous extends NonNullable<Ref<infer Left>>
        ? Next extends NonNullable<Ref<infer Right>>
          ? RefCallback<Left & Right>
          : Next
        : Next
    : Key extends "style"
      ? Previous extends object
        ? Next extends object
          ? Next & Omit<Previous, keyof Next>
          : Next
        : Next
      : Next

type Merge<A, B> = Omit<A, keyof B> & {
  [K in keyof B]: K extends keyof A ? MergeValue<K, A[K], B[K]> : B[K]
}

type MergeAll<
  Sources extends (object | undefined)[],
  Result = object,
> = Sources extends [infer Source, ...infer Rest extends (object | undefined)[]]
  ? MergeAll<Rest, Merge<Result, Source extends object ? Source : object>>
  : Result

/** Later defined values win. Composed handlers run in source order. */
export function mergeProps<Sources extends (object | undefined)[]>(
  ...sources: Sources
): MergeAll<Sources> {
  const result: { [key: string]: unknown } = {}

  for (const source of sources)
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value === undefined) continue
      const previous = Object.hasOwn(result, key) ? result[key] : undefined
      if (key === "ref" && value === null && previous !== undefined) continue
      if (
        key === "className" &&
        typeof previous === "string" &&
        typeof value === "string"
      )
        result[key] = cx(previous, value)
      else if (
        key === "style" &&
        previous !== null &&
        value !== null &&
        typeof previous === "object" &&
        typeof value === "object"
      )
        result[key] = { ...previous, ...value }
      else if (key === "ref" && previous && value)
        result[key] = mergeRefs(previous as Ref<unknown>, value as Ref<unknown>)
      else if (
        /^on[A-Z]/.test(key) &&
        typeof previous === "function" &&
        typeof value === "function"
      )
        result[key] = (...args: unknown[]) => {
          previous(...args)
          return value(...args)
        }
      else
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          value,
          writable: true,
        })
    }

  return result as MergeAll<Sources>
}
