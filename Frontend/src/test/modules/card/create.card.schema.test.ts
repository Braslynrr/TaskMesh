import { createCardSchema } from "@/modules/card/card.schema"
import { describe, it, expect } from "vitest"

describe("create card Schema", () => {
  it("fails when title has less than 4 characters", () => {
    expect(() =>
      createCardSchema.parse({
        listId: "096b0abc98937822669a7c41",
        title: "tes",
        description: "some test for testing purposes"
      })
    ).toThrow("title must be at least 4 characters")
  })

   it("fails when description has less than 4 characters", () => {
    expect(() =>
      createCardSchema.parse({
        listId: "096b0abc98937822669a7c41",
        title: "test",
        description: "test"
      })
    ).toThrow("card should have a description (minimun of 10 characters)")
  })

})