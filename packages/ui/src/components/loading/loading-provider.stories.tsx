import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "../button"
import { LoadingProvider, useLoading } from "./index"

function LoadingControls() {
  const { background, page, screen } = useLoading()
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spaces-2)" }}>
      <Button
        onClick={() =>
          screen.start({ duration: 2500, message: "Preparing workspace" })
        }
      >
        Load screen
      </Button>
      <Button
        onClick={() =>
          page.start({ duration: 2500, message: "Loading records" })
        }
      >
        Load page
      </Button>
      <Button
        onClick={() =>
          background.start({ duration: 2500, message: "Syncing changes" })
        }
      >
        Sync in background
      </Button>
    </div>
  )
}

const meta = {
  component: LoadingProvider,
  title: "Components/Loading/Provider",
} satisfies Meta<typeof LoadingProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Modes: Story = {
  render: () => (
    <LoadingProvider
      background={{ loadingScheme: "dots" }}
      page={{ loadingScheme: "circles" }}
    >
      <LoadingControls />
    </LoadingProvider>
  ),
}
