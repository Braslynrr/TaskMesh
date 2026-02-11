import { getConfig } from "../../core/config/config"

describe("config", () => {

    it("returns same instance on multiple calls", () => {
        const a = getConfig()
        const b = getConfig()
        expect(a).toBe(b)
    })

    it("does not change after first load", () => {
        process.env.JWT_SECRET = "abcdefghij1"
        const config1 = getConfig()

        process.env.JWT_SECRET = "abcdefghij2"
        const config2 = getConfig()

        expect(config2.jwt.secret.value).toBe("test-secret1")
    })

    it("maps env vars correctly", () => {
        process.env.JWT_SECRET = "abcdefghij"
        process.env.MONGO_URI = "mongo://test"

        const config = getConfig()

        expect(config.jwt.secret.value).toBe("test-secret1")
        expect(config.db.url).not.toBe("mongo://test")
    })
})