import request from "supertest"
import app from "../../app"

describe("POST /api/user/login", () => {
    
  it("should login a user", async () => {

    await request(app)
          .post("/api/user/register")
          .send({
            username: "test",
            password: "123456789"
          })


    const res = await request(app)
      .post("/api/user/login")
      .send({
        username: "test",
        password: "123456789"
      })

    expect(res.status).toBe(200)

    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty("token")
    expect(res.body).toHaveProperty("user")
    expect(res.body.user.id).not.toBeNull()
  })

  it("should fail if payload is invalid (username)", async () => {

    await request(app)
          .post("/api/user/register")
          .send({
            username: "test",
            password: "123456789"
          })


    const res = await request(app)
      .post("/api/user/login")
      .send({
        username: "test1",
        password: "123456789"
      })

    expect(res.status).toBe(401)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Username or password credentials are not valid.")
  })

  it("should fail if payload is invalid (password)", async () => {

    await request(app)
          .post("/api/user/register")
          .send({
            username: "test",
            password: "123456789"
          })


    const res = await request(app)
      .post("/api/user/login")
      .send({
        username: "test",
        password: "12345678"
      })

    expect(res.status).toBe(401)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Username or password credentials are not valid.")
  })

})


