import type { Meta, StoryObj } from "@storybook/react-vite"
import { Swatch } from "../../../.storybook/theme-samples"
import { colorSchemeVar } from "../../core/tokens"
import { colorSchemeRoles, colorSchemes } from "./color-schemes"

const meta = { title: "Theme/Semantic tokens/Color schemes" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <table>
      <caption>Color scheme roles</caption>
      <thead>
        <tr>
          <th scope="col">Scheme</th>
          {colorSchemeRoles.map((role) => (
            <th key={role} scope="col">
              {role}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {colorSchemes.map((scheme) => (
          <tr key={scheme} data-scheme={scheme}>
            <th scope="row">{scheme}</th>
            {colorSchemeRoles.map((role) => (
              <td key={role} style={{ padding: "var(--spaces-2)" }}>
                <Swatch color={"var(" + colorSchemeVar(role) + ")"} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
