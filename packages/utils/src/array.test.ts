import { unique } from "./array"

describe("unique", () => {
  test("removes duplicates and keeps order", () => {
    expect(unique([3, 1, 3, 2, 1])).toStrictEqual([3, 1, 2])
  })
})
