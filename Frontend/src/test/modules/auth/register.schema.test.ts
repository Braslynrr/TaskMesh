
import { registerSchema } from "@/modules/auth/auth.schemas"
import { describe, it, expect } from "vitest"


describe("registerSchema", () => {

    it("fails when username has less than 4 characters", () => {
        expect(() =>
            registerSchema.parse({
            username: "tes",
            password: "12345678",
            confirmPassword:"12345678"
            })
        ).toThrow("Username must be at least 4 characters")
    })
 

    it("fails when password has less than 8 characters", () => {
        expect(() =>
        registerSchema.parse({
            username: "test",
            password: "1234567",
            confirmPassword:"1234567"
        })
        ).toThrow("Password must be at least 8 characters")
    })


    it("fails when password are different", () => {
        expect(() =>
        registerSchema.parse({
            username: "test",
            password: "12345678",
            confirmPassword:"12345679"
        })
        ).toThrow("Passwords do not match")
    })

})