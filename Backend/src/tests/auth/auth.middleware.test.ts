import request from "supertest"
import express from "express"
import cookieParser from "cookie-parser"
import { authMiddleware } from "../../core/middlewares/auth.middleware"
import { createAuthUser } from "../factories/user.factory"
import { errorHandler } from "../../core/middlewares/error-handler"


function createTestApp() {
  const app = express()
  app.use(cookieParser())
  app.use(express.json())

  app.get(
    "/protected",
    authMiddleware,
    (_req, res) => res.sendStatus(200)
  )

  app.use(errorHandler)
  return app
}


describe("Auth middleware", () => {

    it("rejects request without token", async () => {

        const app = createTestApp()
        const res = await request(app).get("/protected")
        expect(res.status).toBe(401)
        expect(res.body.issues[0].message).toBe("Missing token")
    })

    it("rejects request with invalid token", async () => {

        const app = createTestApp()
        const res = await request(app)
            .get("/protected")
            .set("Cookie", `auth_token=12asd343513asd5478`)
        expect(res.status).toBe(401)
        expect(res.body.issues[0].message).toBe("Invalid or expired token")
    })

    it("allows request with valid token", async () => {
        const {token} = await createAuthUser()

        const app = createTestApp()

        const res = await request(app)
            .get("/protected")
            .set("Cookie", `auth_token=${token}`)
            

        expect(res.status).toBe(200)
    })

})