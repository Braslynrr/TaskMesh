import { extractApiErrorMessage } from "@/lib/api-error"
import { describe, it, expect } from "vitest"


describe("extractApiErrorMessage", () => {
  it("returns issue message when present", () => {
    const error = {
      response: {
        data: {
          error: "UnauthorizedError",
          issues: [{ message: "Invalid credentials" }],
        },
      },
    }

    expect(extractApiErrorMessage(error)).toBe("Invalid credentials")
  })

  it("falls back to generic message", () => {
    expect(extractApiErrorMessage({})).toBe("Unexpected error")
  })
})