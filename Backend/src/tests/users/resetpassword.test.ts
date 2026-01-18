import request from "supertest"
import app from "../../app"

describe("POST /api/user/password", () => {

  it("fails when username is incorrect", async () => {
     await request(app)
          .post("/api/user/register")
          .send({
            username: "test",
            password: "123456789"
          })

      const res = await request(app)
      .post("/api/user/password")
      .send({
        username: "test1",
        password: "123456789"
      })

    expect(res.status).toBe(401)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Username is not registered.")
  })

  it("fails when passwork is the same", async () => {
     await request(app)
          .post("/api/user/register")
          .send({
            username: "test",
            password: "123456789"
          })

    const res = await request(app)
      .post("/api/user/password")
      .send({
        username: "test",
        password: "123456789"
      })

    expect(res.status).toBe(409)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Username already has the same password.")
  })

  it("resets the user password", async () => {
    await request(app)
          .post("/api/user/register")
          .send({
            username: "test",
            password: "123456789"
          })

    const res1 = await request(app)
      .post("/api/user/password")
      .send({
        username: "test",
        password: "987654321"
      })

    expect(res1.status).toBe(200)

    const res2 = await request(app)
      .post("/api/user/login")
      .send({
        username: "test",
        password: "987654321"
      })

    expect(res2.status).toBe(200)
  })

})