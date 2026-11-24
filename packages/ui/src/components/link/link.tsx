"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { useId } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { linkStyle } from "./link.style"

export interface LinkProps
  extends
    Omit<ComponentProps<"a">, "color">,
    ComponentStyleProps<typeof linkStyle> {
  /** The destination URL. */
  href: string
  /**
   * The color scheme used for the link.
   *
   * @default "primary"
   */
  colorScheme?: ComponentStyleProps<typeof linkStyle>["colorScheme"]
  /**
   * Show the external destination indicator and protect the opener.
   *
   * @default true for absolute HTTP(S) and protocol-relative URLs.
   */
  external?: boolean
  /**
   * The accessible description for an external destination.
   *
   * @default "External link"
   */
  externalLabel?: string
}

export function Link({
  href,
  rel,
  target,
  "aria-describedby": describedBy,
  children,
  external = /^(?:https?:)?\/\//i.test(href.trim()),
  externalLabel = "External link",
  ...props
}: LinkProps) {
  const externalDescriptionId = useId()
  const [styleAttributes, rest] = splitStyleProps("link", linkStyle, props)

  if (external || target?.toLowerCase() === "_blank") {
    const relationships = new Set(
      rel?.match(/\S+/g)?.map((value) => value.toLowerCase()),
    )
    relationships.delete("opener")
    relationships.add("noopener")
    relationships.add("noreferrer")
    rel = [...relationships].join(" ")
  }

  if (external)
    describedBy = describedBy
      ? `${describedBy} ${externalDescriptionId}`
      : externalDescriptionId

  return (
    <a
      {...styleAttributes}
      {...rest}
      href={href}
      rel={rel}
      target={target}
      aria-describedby={describedBy}
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true" data-part="external-indicator">
            {"↗\uFE0E"}
          </span>
          <span id={externalDescriptionId} hidden>
            {externalLabel}
          </span>
        </>
      )}
    </a>
  )
}
