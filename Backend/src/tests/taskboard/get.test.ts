import request from "supertest"
import app from "../../app"
import { createAuthUser, createUser } from "../factories/user.factory"
import { createTaskboard, createTaskboardWithMembers } from "../factories/taskboard.factory"
import { serializeUser } from "../../modules/Users/user.serializer"

describe("GET /api/taskboard/", () => {

  it("fails if user is not member of the taskboard", async () => {

    const {taskboard} = await createTaskboard()
    const {token} = await createAuthUser("test1")

    const res = await request(app)
      .get(`/api/taskboard/${taskboard._id}`)
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(403)
    expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")

  })

  it("should retrieve user taskboards by ownerId", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const idList = memberlist.map(m => m._id.toString())
    const toCompareList =  memberlist.map(u=> ({username: u.username, _id:u._id.toString()}))
    const {token} = await createTaskboardWithMembers(idList)

    const res = await request(app)
      .get("/api/taskboard/")
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body[0].members).toMatchObject(toCompareList)
  })

  it("should retrieve user taskboards by member", async () => {

    const {token, user} = await createAuthUser("test1")
    const memberlist = [ user, await createUser("test2")]

    const toCompareList =  memberlist.map(u=> ({username: u.username, _id:u._id.toString()}))
    const idList = memberlist.map(m => m._id.toString())

    await createTaskboardWithMembers(idList)

    const res = await request(app)
      .get("/api/taskboard/")
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body[0].members).toMatchObject(toCompareList)

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

  it("should retrieve taskboard by taskboardId", async () => {

    const {token, user, taskboard} = await createTaskboard()

    const res = await request(app)
      .get(`/api/taskboard/${taskboard._id}`)
      .set("Cookie", `auth_token=${token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      _id: taskboard._id.toString(),
      name:taskboard.name,
      owner: user
    })

  })

    it("should retrieve user taskboards with members by taskboardId", async () => {

      const memberlist = [ await createUser("test1"), await createUser("test2")]
      const idList = memberlist.map(m => m._id.toString())

      const {token, taskboard ,user} = await createTaskboardWithMembers(idList)

      const res = await request(app)
        .get(`/api/taskboard/${taskboard._id.toString()}`)
        .set("Cookie", `auth_token=${token}`)
        .send()

      expect(res.status).toBe(200)
      expect(res.body).not.toBeNull()
      expect(res.body.members).toMatchObject([{username:"test1"},{username:"test2"}])
  })

})