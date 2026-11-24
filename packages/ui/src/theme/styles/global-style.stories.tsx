import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = { title: "Theme/Styles/Global style" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <section aria-label="Global style samples">
      <p>Select this text to see the selection color.</p>
      <button type="button">Tab to this button to see the focus ring</button>
    </section>
  ),
}
