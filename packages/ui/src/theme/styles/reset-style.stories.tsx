import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = { title: "Theme/Styles/Reset style" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <section
      style={{ display: "grid", gap: "var(--spaces-4)" }}
      aria-label="Reset style samples"
    >
      <article>
        <h2>Heading and paragraph</h2>
        <p>The reset removes their default margins.</p>
      </article>
      <ul>
        <li>The reset removes default list bullets.</li>
      </ul>
      <label>
        Native input <input placeholder="Inherits the page font" />
      </label>
    </section>
  ),
}
