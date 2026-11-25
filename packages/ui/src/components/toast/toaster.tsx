"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { ToastStore } from "./toast-store"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { NoticeItem } from "../notice"
import { toastDefaults } from "./toast-config"
import { toast } from "./toast-store"
import { toastStyle } from "./toast.style"

export interface ToasterProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof toastStyle> {
  /** Maximum number of simultaneously visible toasts. @default 5 */
  limit?: number
  /** Backing toast store instance. Defaults to the global `toast` singleton. */
  store?: ToastStore
}

/** Accessible live region that renders active notifications from a toast store. */
export function Toaster({
  "aria-label": label,
  limit = toastDefaults.limit,
  store = toast,
  ...props
}: ToasterProps) {
  const regionRef = useRef<HTMLDivElement>(null)
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  )
  const visible = items.slice(-limit)
  const [attributes, rest] = splitStyleProps("toast", toastStyle, props)

  useEffect(() => {
    const region = regionRef.current
    if (!region) return

    const pause = () => store.pause()
    const resume = () => store.resume()
    const onFocusOut = (event: FocusEvent) => {
      if (
        !(event.relatedTarget instanceof Node) ||
        !region.contains(event.relatedTarget)
      )
        store.resume()
    }

    region.addEventListener("pointerenter", pause)
    region.addEventListener("pointerleave", resume)
    region.addEventListener("focusin", pause)
    region.addEventListener("focusout", onFocusOut)

    return () => {
      region.removeEventListener("pointerenter", pause)
      region.removeEventListener("pointerleave", resume)
      region.removeEventListener("focusin", pause)
      region.removeEventListener("focusout", onFocusOut)
    }
  }, [store])

  return (
    <div
      ref={regionRef}
      aria-label={label ?? toastDefaults.regionLabel}
      aria-live="polite"
      aria-relevant="additions text"
      role="region"
      {...attributes}
      {...rest}
    >
      {visible.map((item) => (
        <NoticeItem
          key={item.id}
          variant={item.variant}
          closable={item.closable}
          description={item.description}
          loadingScheme={item.status === "loading" ? "oval" : undefined}
          status={item.status === "loading" ? "info" : item.status}
          title={item.title}
          onClose={() => store.dismiss(item.id)}
        />
      ))}
    </div>
  )
}
