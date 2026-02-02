import { createListSchema } from "@/modules/list/list.schemas"
import { describe, it, expect } from "vitest"

describe("create List Schema", () => {
  it("fails when title has less than 4 characters", () => {
    expect(() =>
      createListSchema.parse({
        title: "tit",
        taskboardId: "11111",
      })
    ).toThrow("title must be at least 4 characters")
  })

})