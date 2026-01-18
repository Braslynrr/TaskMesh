import request from "supertest"
import app from "../../app"
import { createAuthUser } from "../factories/user.factory"

describe("POST /api/taskboard/create", () => {
    
  it("should create a taskboard", async () => {
    const {token} = await createAuthUser()

    const res = await request(app)
      .post("/api/taskboard/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "test"
      })

    expect(res.status).toBe(201)
    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty("ownerId")
    expect(res.body._id).not.toBeNull()

  })


  it("should create a taskboard with the correct ownerID", async () => {
    const {user,token} = await createAuthUser()

    const res = await request(app)
      .post("/api/taskboard/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "test",
        ownerId: "testing_id"
      })

    expect(res.status).toBe(201)
    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty("ownerId")
    expect(res.body.ownerId).toBe(user._id)

  })

  it("fails when name is too short", async () => {
    const {token} = await createAuthUser()

    const res = await request(app)
      .post("/api/taskboard/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "tes"
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Too small: expected string to have >=4 characters")

  })

})