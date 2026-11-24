import type { ComponentPropsWithRef, ElementType, ReactElement } from "react"
import type { ThemeProps } from "./define"
import type { StyleDataAttributes } from "./split-style-props"
import type { ComponentSlotStyle, ComponentStyle } from "./types"
import { createContext, createElement, useContext } from "react"
import { mergeProps } from "./merge-props"
import { resolveStyleAttributes, stylePropNames } from "./split-style-props"
import { componentClassName, slotClassName } from "./style-attributes"

type PropsRecord = { [key: string]: unknown }
type ElementProps<Props extends object, Element extends ElementType> = Omit<
  ComponentPropsWithRef<NoInfer<Element>>,
  "as" | keyof Props
> &
  Props & {
    as?: Element
  }
type PropTransform<Props extends object> =
  | ((props: Props) => object)
  | Partial<Props>
type FactoryComponent<Props extends object, Element extends ElementType> = (<
  As extends ElementType = Element,
>(
  props: ElementProps<Props, As>,
) => ReactElement) & {
  displayName?: string
}

function createContexts<Props extends object, Ctx>(name: string) {
  const PropsContext = createContext<Partial<Props> | undefined>(undefined)
  const ComponentContext = createContext<Ctx | undefined>(undefined)
  PropsContext.displayName = `${name}.PropsContext`
  ComponentContext.displayName = `${name}.ComponentContext`

  return {
    ComponentContext,
    PropsContext,
    useComponentContext: () => useContext(ComponentContext),
    usePropsContext: () => useContext(PropsContext),
  }
}

function applyTransform<Props extends object>(
  props: Props,
  transform: PropTransform<Props>,
): Props {
  return (
    typeof transform === "function"
      ? transform(props)
      : mergeProps(transform, props)
  ) as Props
}

function createRenderer<
  Props extends object,
  Transformed extends object = Props,
>(
  name: string,
  className: string,
  resolve: (props: Props) => {
    props: Transformed
    provide?: (element: ReactElement) => ReactElement
  },
  useDefaults: () => Partial<Props> | undefined = () => undefined,
) {
  return function <Element extends ElementType>(element: Element) {
    type Input = ElementProps<Props, Element>
    type Output = ElementProps<Transformed, Element> & StyleDataAttributes

    return (
      initial?: PropTransform<Input>,
      ...transforms: PropTransform<Output>[]
    ): FactoryComponent<Props, Element> => {
      function Component<As extends ElementType = Element>(
        input: ElementProps<Props, As>,
      ) {
        const defaults = useDefaults()
        const merged = mergeProps(defaults, input) as unknown as Input
        const { props, provide } = resolve(
          initial ? applyTransform(merged, initial) : merged,
        )
        const resolved = transforms.reduce(
          applyTransform<Output>,
          props as Output,
        )
        const { as, ...forwarded } = resolved
        const rendered = createElement(
          as ?? element,
          mergeProps({ className }, forwarded),
        )
        return provide ? provide(rendered) : rendered
      }

      Component.displayName = name
      return Component
    }
  }
}

function withoutStyleProps(props: object, names: Iterable<string>) {
  const forwarded: PropsRecord = { ...props }
  for (const name of names) delete forwarded[name]
  return forwarded
}

export function createComponent<
  Props extends object = object,
  Style extends ComponentStyle = {},
  Ctx = unknown,
>(name: string, style: Style) {
  type Input = Props & ThemeProps<Style>
  const contexts = createContexts<Input, Ctx>(name)
  const styleProps = stylePropNames(style)

  return {
    ...contexts,
    component: createRenderer<Props>(
      name,
      componentClassName(name),
      (props) => ({ props }),
    ),
    withContext: createRenderer<Input, Props>(
      name,
      componentClassName(name),
      (props) => ({
        props: {
          ...withoutStyleProps(props, styleProps),
          ...resolveStyleAttributes(styleProps, props, style.defaultProps),
        } as Props,
      }),
      contexts.usePropsContext,
    ),
  }
}

function recipeSlots(recipe: ComponentSlotStyle) {
  const names = new Set(["root", ...Object.keys(recipe.defaultProps ?? {})])
  const sheets = [
    recipe.base ?? {},
    ...Object.values(recipe.sizes ?? {}),
    ...Object.values(recipe.variants ?? {}),
    ...Object.values(recipe.props ?? {}).flatMap(Object.values),
    ...(recipe.compounds ?? []).map(({ css }) => css),
  ]
  for (const sheet of sheets)
    for (const slot of Object.keys(sheet)) names.add(slot)
  return names
}

export function createSlotComponent<
  RootProps extends object = object,
  Style extends ComponentSlotStyle = ComponentSlotStyle,
  Ctx = unknown,
>(name: string, style: Style) {
  type Input = RootProps & ThemeProps<Style>
  const contexts = createContexts<Input, Ctx>(name)
  const StyleContext = createContext<
    Readonly<Partial<{ [key: string]: StyleDataAttributes }>> | undefined
  >(undefined)
  StyleContext.displayName = `${name}.StyleContext`
  const useStyleContext = () => useContext(StyleContext)
  const styleProps = stylePropNames(style)
  const slots = recipeSlots(style)
  const rootDefaults = style.defaultProps?.root

  function withProvider<Element extends ElementType>(
    element: Element,
    slot = "root",
  ) {
    return createRenderer<Input, RootProps>(
      name,
      slotClassName(name, slot),
      (props) => {
        const input = props as PropsRecord
        const root = resolveStyleAttributes(styleProps, input, rootDefaults)
        const attributes = Object.fromEntries(
          [...slots].map((slotName) => {
            const slotDefaults = style.defaultProps?.[slotName]
            return [
              slotName,
              slotName === "root" || !slotDefaults
                ? root
                : resolveStyleAttributes(styleProps, input, {
                    ...rootDefaults,
                    ...slotDefaults,
                  }),
            ]
          }),
        )
        return {
          props: {
            ...withoutStyleProps(props, styleProps),
            ...(attributes[slot] ?? root),
          } as RootProps,
          provide: (child) =>
            createElement(StyleContext, { value: attributes }, child),
        }
      },
      contexts.usePropsContext,
    )(element)
  }

  function withContext<
    Element extends ElementType,
    Props extends object = object,
  >(element: Element, slot = "root") {
    function useSlotAttributes() {
      const attributes = useStyleContext()
      return (attributes?.[slot] ?? attributes?.root) as
        | Partial<Props>
        | undefined
    }
    return createRenderer<Props>(
      `${name}.${slot}`,
      slotClassName(name, slot),
      (props) => ({ props }),
      useSlotAttributes,
    )(element)
  }

  function component<
    Element extends ElementType,
    Props extends object = object,
  >(element: Element, slot = "root") {
    return createRenderer<Props>(
      `${name}.${slot}`,
      slotClassName(name, slot),
      (props) => ({ props }),
    )(element)
  }

  return {
    ...contexts,
    component,
    StyleContext,
    useStyleContext,
    withContext,
    withProvider,
  }
}
