import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Button } from "../button"
import { Card } from "../card"
import { Stack } from "../stack"
import { Collapse } from "./collapse"
import { Fade } from "./fade"
import { ScaleFade } from "./scale-fade"
import { Slide } from "./slide"
import { SlideFade } from "./slide-fade"

const meta = {
  component: Fade,
  title: "Components / Motion",
} satisfies Meta<typeof Fade>

export default meta

type Story = StoryObj<typeof meta>

export const FadeTransition: Story = {
  name: "Fade",
  render: function FadeStory() {
    const [open, setOpen] = useState(true)
    return (
      <Stack align="start" gap="3">
        <Button onClick={() => setOpen((value) => !value)}>Toggle Fade</Button>
        <Fade open={open}>
          <Card.Root variant="subtle">
            <Card.Body>Fade transitions opacity cleanly.</Card.Body>
          </Card.Root>
        </Fade>
      </Stack>
    )
  },
}

export const ScaleFadeTransition: Story = {
  name: "ScaleFade",
  render: function ScaleFadeStory() {
    const [open, setOpen] = useState(true)
    return (
      <Stack align="start" gap="3">
        <Button onClick={() => setOpen((value) => !value)}>
          Toggle ScaleFade
        </Button>
        <ScaleFade initialScale={0.92} open={open}>
          <Card.Root variant="subtle">
            <Card.Body>ScaleFade combines scale and opacity.</Card.Body>
          </Card.Root>
        </ScaleFade>
      </Stack>
    )
  },
}

export const SlideFadeTransition: Story = {
  name: "SlideFade",
  render: function SlideFadeStory() {
    const [open, setOpen] = useState(true)
    return (
      <Stack align="start" gap="3">
        <Button onClick={() => setOpen((value) => !value)}>
          Toggle SlideFade
        </Button>
        <SlideFade offsetY="12px" open={open}>
          <Card.Root variant="subtle">
            <Card.Body>
              SlideFade translates and fades simultaneously.
            </Card.Body>
          </Card.Root>
        </SlideFade>
      </Stack>
    )
  },
}

export const SlideTransition: Story = {
  name: "Slide",
  render: function SlideStory() {
    const [open, setOpen] = useState(false)
    return (
      <Stack align="start" gap="3">
        <Button onClick={() => setOpen((value) => !value)}>
          {open ? "Close Slide" : "Open Slide"}
        </Button>
        <Slide open={open} placement="bottom" unmountOnExit>
          <Card.Root variant="panel">
            <Card.Body>
              Fixed bottom slide panel.
              <Button variant="outline" onClick={() => setOpen(false)}>
                Dismiss
              </Button>
            </Card.Body>
          </Card.Root>
        </Slide>
      </Stack>
    )
  },
}

export const CollapseTransition: Story = {
  name: "Collapse",
  render: function CollapseStory() {
    const [open, setOpen] = useState(true)
    return (
      <Stack align="start" gap="3">
        <Button onClick={() => setOpen((value) => !value)}>
          Toggle Collapse
        </Button>
        <Collapse open={open}>
          <Card.Root variant="subtle">
            <Card.Body>
              Collapse smoothly reveals and hides vertical content.
            </Card.Body>
          </Card.Root>
        </Collapse>
      </Stack>
    )
  },
}
