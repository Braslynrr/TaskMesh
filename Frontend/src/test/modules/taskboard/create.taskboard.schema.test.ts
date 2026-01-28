import { createTaskboardSchema } from "@/modules/taskboard/taskboard.schemas"
import { describe, it, expect } from "vitest"

describe("create Taskboard Schema", () => {
  it("fails when name has less than 4 characters", () => {
    expect(() =>
      createTaskboardSchema.parse({
        name: "tes"
      })
    ).toThrow("name must be at least 4 characters")
  })

})