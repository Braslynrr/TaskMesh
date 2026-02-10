import request from "supertest"
import app from "../../app"
import { createAuthUser, createUser } from "../factories/user.factory"
import { createTaskboard } from "../factories/taskboard.factory"

describe("POST /api/taskboard/add", () => {

  it("fails when members is empty", async () => {
    const {token, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Cookie", `auth_token=${token}`)
      .send({
        _id: taskboard._id,
        members: []
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Too small: expected array to have >=1 items")

  })


  it("fails when owner is sent and there's no more members to add", async () => {
    const {token,user, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Cookie", `auth_token=${token}`)
      .send({
        _id: taskboard._id,
        members: [user.username]
      })

    expect(res.status).toBe(409)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("the user is already a member")

  })

    it("fails when _id is incorrect", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const usernmaeList = memberlist.map(m => m.username)
    const {token} = await createTaskboard()


    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Cookie", `auth_token=${token}`)
      .send({
        _id: "096b0abc98937822669a7c40",
        members: usernmaeList
      })

    expect(res.status).toBe(404)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("taskboard was not found")

  })


    it("fails when _id is not an uuid", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const usernmaeList = memberlist.map(m => m.username)
    const {token} = await createTaskboard()


    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Cookie", `auth_token=${token}`)
      .send({
        _id: "test",
        members: usernmaeList
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Invalid ObjectId")

  })

  it("fails when user is not taskboard owner", async () => {

        const {taskboard, user} = await createTaskboard()
        const {token} = await createAuthUser("test3")

        const memberlist = [ await createUser("test1"), await createUser("test2")]
        const usernmaeList = memberlist.map(m => m.username)

        const res = await request(app)
        .post("/api/taskboard/add")
        .set("Cookie", `auth_token=${token}`)
        .send({
            _id: taskboard._id,
            members: usernmaeList,
            ownerId: user._id
        })

        expect(res.status).toBe(403)
        expect(res.body).not.toBeNull()
        expect(res.body.issues[0].message).toBe("only owner can perform this action")
      })


    it("fails when username does not exist", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const usernmaeList = memberlist.map(m => m.username)
    const toCompareList =  memberlist.map(u=> ({username: u.username, _id:u._id.toString()}))
    const {token, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Cookie", `auth_token=${token}`)
      .send({
        _id: taskboard._id.toString(),
        members: ["any member"]
      })

    expect(res.status).toBe(404)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("given username is not registered")
  })
    

    it("should add members to taskboard", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const usernmaeList = memberlist.map(m => m.username)
    const toCompareList =  memberlist.map(u=> ({username: u.username, _id:u._id.toString()}))
    const {token, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Cookie", `auth_token=${token}`)
      .send({
        _id: taskboard._id.toString(),
        members: usernmaeList
      })

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body.members).toMatchObject(toCompareList)

  })
})