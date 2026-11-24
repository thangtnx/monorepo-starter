"use client"

import type { ReactNode } from "react"
import type { LoadingScheme } from "./loading-schemes"
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { Stack } from "../stack"
import { VisuallyHidden } from "../visually-hidden"
import { loadingDefaults } from "./loading-config"
import { loadingSchemes } from "./loading-schemes"

export interface LoadingLayerProps {
  /** Allow pinch zoom while scroll is blocked. @default false */
  allowPinchZoom?: boolean
  /** Prevent scrolling behind the loader. Defaults to true for screen and page. */
  blockScrollOnMount?: boolean
  /** Milliseconds before calling onFinish. Use null to wait indefinitely. @default null */
  duration?: null | number
  /** Whether to animate the entrance. @default true */
  initial?: boolean | string
  /** The indicator to display. @default "oval" */
  loadingScheme?: LoadingScheme
  /** Message displayed alongside the indicator. */
  message?: ReactNode
  /** Callback when the duration expires. */
  onFinish?: () => void
}

type LoadingMode = "background" | "page" | "screen"

const subscribeToPortalHost = () => () => {}

export function useLoadingTimeout(
  duration: null | number | undefined,
  onFinish?: () => void,
) {
  useEffect(() => {
    if (duration == null || !Number.isFinite(duration) || !onFinish) return
    const timer = setTimeout(onFinish, Math.max(0, duration))
    return () => clearTimeout(timer)
  }, [duration, onFinish])
}

export function LoadingLayer({
  allowPinchZoom = false,
  mode,
  blockScrollOnMount = mode !== "background",
  duration,
  initial = true,
  loadingScheme = "oval",
  message,
  onFinish,
}: LoadingLayerProps & { mode: LoadingMode }) {
  const blocking = mode !== "background"
  const textMessage = typeof message === "string" || typeof message === "number"
  const dialogRef = useRef<HTMLDialogElement>(null)
  const host = useSyncExternalStore(
    subscribeToPortalHost,
    () => document.body,
    () => null,
  )
  const Indicator = loadingSchemes[loadingScheme]
  useLoadingTimeout(duration, onFinish)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previous = document.activeElement
    if (typeof dialog.showModal === "function") dialog.showModal()
    else dialog.open = true
    if (!dialog.contains(document.activeElement)) dialog.focus()

    return () => {
      if (typeof dialog.close === "function") dialog.close()
      else dialog.open = false
      queueMicrotask(() => {
        if (
          previous instanceof HTMLElement &&
          previous.isConnected &&
          document.activeElement === document.body
        )
          previous.focus()
      })
    }
  }, [blocking, host])

  const attributes = {
    className: "ui-loading-layer",
    "data-enter": initial === false ? undefined : "",
    "data-lock": blockScrollOnMount
      ? allowPinchZoom
        ? "scroll"
        : "all"
      : undefined,
    "data-screen": mode === "screen" ? "" : undefined,
  }
  const content = (
    <Stack
      align="center"
      direction={blocking ? "column" : "row"}
      gap="2"
      role="status"
    >
      <Indicator
        decorative
        fontSize={blocking ? "var(--font-sizes-6xl)" : "var(--font-sizes-xl)"}
      />
      {message ? (
        <div className={textMessage ? "ui-loading-message" : undefined}>
          {message}
        </div>
      ) : (
        <VisuallyHidden>{loadingDefaults.label}</VisuallyHidden>
      )}
    </Stack>
  )
  if (!host) return null

  return createPortal(
    blocking ? (
      <dialog
        {...attributes}
        ref={dialogRef}
        aria-label={
          typeof message === "string" && message
            ? message
            : loadingDefaults.label
        }
        tabIndex={-1}
        onCancel={(event) => event.preventDefault()}
      >
        {content}
      </dialog>
    ) : (
      <div {...attributes}>{content}</div>
    ),
    host,
  )
}

export function LoadingScreen(props: LoadingLayerProps) {
  return <LoadingLayer {...props} mode="screen" />
}

export function LoadingPage(props: LoadingLayerProps) {
  return <LoadingLayer {...props} mode="page" />
}

export function LoadingBackground(props: LoadingLayerProps) {
  return <LoadingLayer {...props} mode="background" />
}
