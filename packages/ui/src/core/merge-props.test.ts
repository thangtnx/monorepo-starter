import { createRef } from "react"
import { cx, dataAttr, mergeProps, mergeRefs } from "./merge-props"

describe("mergeProps", () => {
  test("combines classes and styles while retaining the latest defined values", () => {
    const first = {
      id: "first",
      className: "one",
      style: { color: "red", padding: 4 },
      disabled: true,
    }
    const second = {
      id: undefined,
      className: "two",
      style: { color: "blue" },
      disabled: false,
    }

    const merged = mergeProps(undefined, first, second)
    expectTypeOf(merged.id).toEqualTypeOf<string>()
    expectTypeOf(merged.style.padding).toEqualTypeOf<number>()
    expect(merged).toStrictEqual({
      id: "first",
      className: "one two",
      style: { color: "blue", padding: 4 },
      disabled: false,
    })
    expect(first.style.color).toBe("red")
    expect(second.style).toStrictEqual({ color: "blue" })
  })

  test("runs handlers left to right with the original event", () => {
    const onClick = vi.fn<(event: Event) => void>()
    const next = vi.fn<(event: Event) => void>()
    const last = vi.fn<(event: Event) => void>()
    const event = new Event("click", { cancelable: true })
    onClick.mockImplementation((event) => event.preventDefault())
    const props = mergeProps({ onClick }, { onClick: next }, { onClick: last })
    props.onClick(event)

    expect(onClick).toHaveBeenCalledExactlyOnceWith(event)
    expect(next).toHaveBeenCalledExactlyOnceWith(event)
    expect(last).toHaveBeenCalledExactlyOnceWith(event)
    expect(onClick).toHaveBeenCalledBefore(next)
    expect(next).toHaveBeenCalledBefore(last)
    expect(event.defaultPrevented).toBeTruthy()
  })

  test("replaces styles when either value is null or a primitive", () => {
    const style = { color: "red" }

    expect(mergeProps({ style: null }, { style }).style).toBe(style)
    expect(mergeProps({ style }, { style: null }).style).toBeNull()
    expect(mergeProps({ style: "red" }, { style }).style).toBe(style)
    expect(mergeProps({ style }, { style: "red" }).style).toBe("red")
  })

  test("keeps an earlier ref when a later ref is null", () => {
    const myRef = createRef<HTMLDivElement>()
    const { ref } = mergeProps({ ref: myRef }, { ref: null })

    expectTypeOf(ref).toEqualTypeOf<typeof myRef>()
    expect(ref).toBe(myRef)
    expect(mergeProps({}, { ref: null }).ref).toBeNull()
  })

  test("keeps __proto__ as an own property without changing the prototype", () => {
    const props: object = JSON.parse('{"__proto__":{"polluted":true}}')
    const merged = mergeProps(props)

    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype)
    expect(Object.hasOwn(merged, "__proto__")).toBeTruthy()
    expect(merged).not.toHaveProperty("polluted")
    expect({}).not.toHaveProperty("polluted")
  })

  test("combines object refs, cleanup refs and callbacks", () => {
    const object = createRef<HTMLDivElement>()
    const callback = vi.fn<(node: HTMLDivElement | null) => void>()
    const cleanup = vi.fn()
    const withCleanup = vi.fn(() => cleanup)
    const node = document.createElement("div")

    const { ref } = mergeProps(
      { ref: object },
      { ref: withCleanup },
      { ref: callback },
    )
    const detach = ref(node)
    expect(object.current).toBe(node)
    expect(callback).toHaveBeenCalledExactlyOnceWith(node)
    expect(withCleanup).toHaveBeenCalledExactlyOnceWith(node)

    if (typeof detach === "function") detach()
    expect(object.current).toBeNull()
    expect(callback.mock.calls).toStrictEqual([[node], [null]])
    expect(withCleanup).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  test("accepts one object ref or absent refs", () => {
    const ref = createRef<HTMLDivElement>()
    const node = document.createElement("div")
    expect(mergeRefs(null, undefined)).toBeUndefined()
    const detach = mergeRefs(ref)?.(node)
    expect(ref.current).toBe(node)
    if (typeof detach === "function") detach()
    expect(ref.current).toBeNull()
  })

  test("provides class and attribute helpers", () => {
    expect(cx("first", undefined, "last")).toBe("first last")
    expect([
      dataAttr(true),
      dataAttr(false),
      dataAttr(0),
      dataAttr(null),
    ]).toStrictEqual(["true", "false", "0", undefined])
  })
})
