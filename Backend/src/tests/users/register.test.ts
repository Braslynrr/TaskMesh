import request from "supertest"
import app from "../../app"
import { UserModel } from "../../modules/Users/user.repository"

describe("POST /api/user/register", () => {

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "test",
        password: "123456789"
      })

    expect(res.status).toBe(201)

    // Verify user was saved
    const user = await UserModel.findOne({ username: "test" })
    expect(user).not.toBeNull()
    expect(user).toHaveProperty("id")
    expect(user.username).toBe("test")
  })

  it("should fail if email already exists", async () => {
    await request(app)
      .post("/api/user/register")
      .send({
        username: "test",
        password: "123456789"
      })

    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "test",
        password: "123456789"
      })

    expect(res.status).toBe(409)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Username is already in use")
  })

  it("should fail if payload is invalid (username)", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "te",
        password: "123456789"
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Too small: expected string to have >=4 characters")
  })

 it("should fail if payload is invalid (password)", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "test",
        password: "123456"
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Too small: expected string to have >=8 characters")
  })

})