import { typeaheadTimeout } from "./select-config"

interface Search {
  text: string
  time: number
}

export function findSelectMatch(
  options: readonly { searchText: string; value: string }[],
  active: string | undefined,
  key: string,
  time: number,
  previous: Search | undefined,
) {
  const character = key.toLocaleLowerCase()
  const prefix =
    previous && time - previous.time < typeaheadTimeout ? previous.text : ""
  const repeated =
    prefix.length > 0 &&
    Array.from(prefix).every((letter) => letter === character)
  const text = repeated ? character : prefix + character
  const current = options.findIndex((option) => option.value === active)
  const start = prefix && !repeated && current >= 0 ? current : current + 1
  const sequence = [...options.slice(start), ...options.slice(0, start)]

  return {
    match: sequence.find((option) => option.searchText.startsWith(text)),
    search: { text, time },
  }
}
