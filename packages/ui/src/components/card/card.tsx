"use client"

import type { ComponentProps } from "react"
import type { ThemeProps } from "../../core/define"
import type { CardStyle } from "./card.style"
import { createSlotComponent } from "../../core/create-component"
import { cardStyle } from "./card.style"

/**
 * Card size controls part spacing and the header font size. The variant
 * controls the surface treatment. The color scheme supplies the palette for
 * the solid, subtle, and surface variants.
 *
 * @property size Defaults to `md`.
 * @property variant Defaults to `panel`.
 * @property colorScheme Defaults to `neutral`.
 */
export interface CardRootProps
  extends Omit<ComponentProps<"article">, "color">, ThemeProps<CardStyle> {}

const {
  PropsContext: CardPropsContext,
  usePropsContext: useCardPropsContext,
  withContext,
  withProvider,
} = createSlotComponent<CardRootProps, CardStyle>("card", cardStyle)

export { CardPropsContext, useCardPropsContext, withContext as withCardContext }

export const CardRoot = withProvider("article", "root")()
