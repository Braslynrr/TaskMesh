import request from "supertest"
import app from "../../app"
import { createAuthUser, createUser } from "../factories/user.factory"
import { createTaskboardWithMembers } from "../factories/taskboard.factory"

describe("GET /api/taskboard/", () => {

  it("should retrieve user taskboards by ownerId", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const idList = memberlist.map(m => m._id.toString())

    const {token, user} = await createTaskboardWithMembers(idList)

    const res = await request(app)
      .get("/api/taskboard/")
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body[0].members).toEqual(idList)
    expect(res.body[0].members).not.toContain(user._id)
    expect(res.body[0].ownerId).toBe(user._id)
  })

    it("should retrieve user taskboards by member", async () => {

    const {token, user} = await createAuthUser("test1")
    const memberlist = [ user, await createUser("test2")]
    const idList = memberlist.map(m => m._id.toString())

    await createTaskboardWithMembers(idList)

    const res = await request(app)
      .get("/api/taskboard/")
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body[0].members).toEqual(idList)
    expect(res.body[0].members).toContain(user._id)
    expect(res.body[0].ownerId).not.toBe(user._id)

  })


  it("should retrieve empty taskboards list", async () => {

    const {token} = await createAuthUser("test")

    const res = await request(app)
      .get("/api/taskboard/")
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])

  })

})