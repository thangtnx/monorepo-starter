"use client"

import type { ReactNode } from "react"
import type { LoadingLayerProps } from "./loading-layer"
import type { LoadingScheme } from "./loading-schemes"
import {
  createContext,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  LoadingBackground,
  LoadingLayer,
  useLoadingTimeout,
} from "./loading-layer"

export interface LoadingOptions {
  /** Milliseconds until this operation finishes, or null to finish manually. */
  duration?: null | number
  /** Indicator displayed while loading. */
  loadingScheme?: LoadingScheme
  /** Message displayed alongside the indicator. */
  message?: ReactNode
}

export interface LoadingState extends LoadingOptions {
  /** Number of outstanding operations in this mode. */
  loadingCount: number
}

export interface LoadingMethods {
  /** Finish one operation. */
  finish: () => void
  /** Replace the current state and reset omitted values to the provider defaults. */
  force: (state: Partial<LoadingState>) => void
  /** Begin an operation. */
  start: (options?: LoadingOptions) => void
  /** Change the active operation's presentation. */
  update: (options: LoadingOptions) => void
}

export interface LoadingConfig
  extends
    LoadingState,
    Pick<LoadingLayerProps, "allowPinchZoom" | "blockScrollOnMount"> {}

export interface LoadingProviderProps {
  /** Defaults for a background notification. */
  background?: Partial<LoadingConfig>
  /** Content whose busy state is managed by the provider. */
  children?: ReactNode
  /** Defaults for a blocking page loader. */
  page?: Partial<LoadingConfig>
  /** Defaults for a blocking full-screen loader. */
  screen?: Partial<LoadingConfig>
}

interface LoadingControls {
  background: LoadingMethods
  page: LoadingMethods
  screen: LoadingMethods
}

const LoadingContext = createContext<LoadingControls | null>(null)

function useLoadingController({
  duration = null,
  loadingCount = 0,
  loadingScheme = "oval",
  message,
  ...layerOptions
}: Partial<LoadingConfig> = {}) {
  const defaults = useMemo(
    () => ({ duration, loadingCount, loadingScheme, message }),
    [duration, loadingCount, loadingScheme, message],
  )
  const [state, setState] = useState<LoadingState>(defaults)
  const [previousDefaults, setPreviousDefaults] = useState(defaults)
  if (previousDefaults !== defaults) {
    setPreviousDefaults(defaults)
    if (loadingCount !== previousDefaults.loadingCount) setState(defaults)
  }

  const methods = useMemo<LoadingMethods>(
    () => ({
      finish: () =>
        setState((current) =>
          current.loadingCount > 1
            ? { ...current, loadingCount: current.loadingCount - 1 }
            : { ...defaults, loadingCount: 0 },
        ),
      force: (next) => setState({ ...defaults, loadingCount: 0, ...next }),
      start: (options) =>
        setState((current) => ({
          ...defaults,
          ...options,
          loadingCount: current.loadingCount + 1,
        })),
      update: (options) => setState((current) => ({ ...current, ...options })),
    }),
    [defaults],
  )

  // Restart the timeout when one operation starts or finishes, even if the duration stays the same.
  const { finish } = methods
  const finishTimedOperation = useCallback(() => {
    if (state.loadingCount > 0) finish()
  }, [finish, state.loadingCount])
  useLoadingTimeout(
    state.loadingCount > 0 ? state.duration : null,
    finishTimedOperation,
  )

  return {
    active: state.loadingCount > 0,
    methods,
    props: {
      ...layerOptions,
      initial: loadingCount === 0,
      loadingScheme: state.loadingScheme,
      message: state.message,
    },
  }
}

export function LoadingProvider({
  background,
  children,
  page,
  screen,
}: LoadingProviderProps) {
  const {
    active: backgroundActive,
    methods: backgroundMethods,
    props: backgroundProps,
  } = useLoadingController(background)
  const {
    active: pageActive,
    methods: pageMethods,
    props: pageProps,
  } = useLoadingController(page)
  const {
    active: screenActive,
    methods: screenMethods,
    props: screenProps,
  } = useLoadingController(screen)
  const blocking = screenActive || pageActive
  const lastFocused = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    // Inert content can lose focus before the dialog opens.
    if (
      !blocking &&
      document.activeElement === document.body &&
      lastFocused.current?.isConnected
    )
      lastFocused.current.focus()
  }, [blocking])
  const controls = useMemo(
    () => ({
      background: backgroundMethods,
      page: pageMethods,
      screen: screenMethods,
    }),
    [backgroundMethods, pageMethods, screenMethods],
  )

  return (
    <LoadingContext value={controls}>
      <div
        className="ui-loading-region"
        aria-busy={blocking}
        inert={blocking}
        onFocusCapture={(event) => {
          if (event.target instanceof HTMLElement)
            lastFocused.current = event.target
        }}
      >
        {children}
      </div>
      {backgroundActive && <LoadingBackground {...backgroundProps} />}
      {blocking && (
        <LoadingLayer
          {...(screenActive ? screenProps : pageProps)}
          mode={screenActive ? "screen" : "page"}
        />
      )}
    </LoadingContext>
  )
}

export function useLoading() {
  const controls = use(LoadingContext)
  if (!controls) throw new Error("useLoading requires a LoadingProvider")
  return controls
}
