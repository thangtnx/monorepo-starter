import type { Meta, StoryObj } from "@storybook/react-vite"
import { useEffect, useState } from "react"
import { keys } from "#storybook"
import { Button } from "../button"
import { createToastStore, Toaster } from "./index"
import { toastStyle } from "./toast.style"

const meta = {
  component: Toaster,
  title: "Components / Toast",
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => {
    const [store] = useState(() => createToastStore())
    useEffect(() => () => store.dismissAll(), [store])

    return (
      <>
        <Button
          onClick={() =>
            store.info({
              description: "Workspace configuration is live.",
              title: "Changes published",
            })
          }
        >
          Show Toast
        </Button>
        <Toaster {...args} store={store} />
      </>
    )
  },
}

export const Status: Story = {
  render: () => {
    const [store] = useState(() => createToastStore())
    useEffect(() => () => store.dismissAll(), [store])

    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {(["info", "success", "warning", "error", "loading"] as const).map(
            (status) => (
              <Button
                key={status}
                variant="outline"
                onClick={() =>
                  store[status]({
                    description: `Triggered ${status} status toast.`,
                    title: `${status} notification`,
                  })
                }
              >
                {status}
              </Button>
            ),
          )}
        </div>
        <Toaster store={store} />
      </>
    )
  },
}

export const Placement: Story = {
  render: () => {
    const [store] = useState(() => createToastStore())
    const [placement, setPlacement] =
      useState<keyof typeof toastStyle.props.placement>("bottom-end")
    useEffect(() => () => store.dismissAll(), [store])

    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {keys(toastStyle.props.placement).map((value) => (
            <Button
              key={value}
              variant={placement === value ? "solid" : "outline"}
              onClick={() => {
                setPlacement(value)
                store.info({
                  description: "Stacked inside the live region.",
                  title: `Placement: ${value}`,
                })
              }}
            >
              {value}
            </Button>
          ))}
        </div>
        <Toaster placement={placement} store={store} />
      </>
    )
  },
}

export const AutoDismissAndPersistentError: Story = {
  render: () => {
    const [store] = useState(() => createToastStore())
    useEffect(() => () => store.dismissAll(), [store])

    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Button
            variant="outline"
            onClick={() =>
              store.success({
                description: "Auto-dismisses after 5 seconds.",
                title: "Export ready",
              })
            }
          >
            Auto-dismiss Toast
          </Button>
          <Button
            colorScheme="danger"
            variant="outline"
            onClick={() =>
              store.error({
                description: "Persists until manually dismissed.",
                title: "Sync error",
              })
            }
          >
            Persistent Error
          </Button>
        </div>
        <Toaster store={store} />
      </>
    )
  },
}
