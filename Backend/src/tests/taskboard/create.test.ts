import request from "supertest"
import app from "../../app"
import { createAuthUser } from "../factories/user.factory"

describe("POST /api/taskboard/create", () => {
    
  it("should create a taskboard", async () => {
    const {token, user} = await createAuthUser()

    const res = await request(app)
      .post("/api/taskboard/create")
      .set("Cookie", `auth_token=${token}`)
      .send({
        name: "test"
      })

    expect(res.status).toBe(201)
    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty("owner")
    expect(res.body.owner).toMatchObject(user)

  })


  it("should create a taskboard with the correct ownerID", async () => {
    const {user,token} = await createAuthUser()

    const res = await request(app)
      .post("/api/taskboard/create")
      .set("Cookie", `auth_token=${token}`)
      .send({
        name: "test",
        ownerId: "testing_id"
      })

    expect(res.status).toBe(201)
    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty("owner")
    expect(res.body.owner).toMatchObject(user)

  })

  it("fails when name is too short", async () => {
    const {token} = await createAuthUser()

    const res = await request(app)
      .post("/api/taskboard/create")
      .set("Cookie", `auth_token=${token}`)
      .send({
        name: "tes"
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Too small: expected string to have >=4 characters")

  })

})