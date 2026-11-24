import { expect, modes, storyIds, test } from "./fixtures"

// Open defects: "<story id>|<mode>" -> the exact violations that story still
// reports. Any other violation, or a fix, fails the test; then remove the entry.
const knownBugs: { [key: string]: { bug: string; violations: string[] } } = {}

for (const id of storyIds())
  for (const mode of modes)
    test(`axe: ${id} (${mode})`, async ({ openStory, scan }) => {
      const known = knownBugs[`${id}|${mode}`]
      test
        .info()
        .annotations.push(
          ...(known ? [{ type: "known-bug", description: known.bug }] : []),
        )
      await openStory(id, mode)

      expect(await scan()).toEqual(known?.violations ?? [])
    })
