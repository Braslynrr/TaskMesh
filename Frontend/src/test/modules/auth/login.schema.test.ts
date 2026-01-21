import { loginSchema } from "@/modules/auth/auth.schemas"
import { describe, it, expect } from "vitest"


describe("loginSchema", () => {
  it("fails when username has less than 4 characters", () => {
    expect(() =>
      loginSchema.parse({
        username: "tes",
        password: "12345678",
      })
    ).toThrow("Username must be at least 4 characters")
  })


  it("fails when password has less than 8 characters", () => {
    expect(() =>
      loginSchema.parse({
        username: "test",
        password: "1234567",
      })
    ).toThrow("Password must be at least 8 characters")
  })
})