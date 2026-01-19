import request from "supertest"
import app from "../../app"
import { createAuthUser, createUser } from "../factories/user.factory"
import { createTaskboard } from "../factories/taskboard.factory"

describe("POST /api/taskboard/add", () => {
    
  it("should add members to taskboard", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const idList = memberlist.map(m => m._id.toString())
    const {token, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        _id: taskboard._id,
        members: idList
      })

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body.members).toEqual(idList)

  })

  it("fails when members is empty", async () => {
    const {token, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        _id: taskboard._id,
        members: []
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Too small: expected array to have >=1 items")

  })

    it("fails when _id is incorrect", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const idList = memberlist.map(m => m._id.toString())
    const {token} = await createTaskboard()


    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        _id: "096b0abc98937822669a7c40",
        members: idList
      })

    expect(res.status).toBe(404)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Taskboard was not found")

  })


    it("fails when _id is not an uuid", async () => {

    const memberlist = [ await createUser("test1"), await createUser("test2")]
    const idList = memberlist.map(m => m._id.toString())
    const {token} = await createTaskboard()


    const res = await request(app)
      .post("/api/taskboard/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        _id: "test",
        members: idList
      })

    expect(res.status).toBe(400)
    expect(res.body).not.toBeNull()
    expect(res.body.issues[0].message).toBe("Invalid ObjectId")

  })

  it("fails when user is not taskboard owner", async () => {

        const {taskboard} = await createTaskboard()
        const {token, user} = await createAuthUser("test3")
  
        const memberlist = [ await createUser("test1"), await createUser("test2")]
        const idList = memberlist.map(m => m._id.toString())

        const res = await request(app)
        .post("/api/taskboard/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: taskboard._id,
            members: idList,
            ownerId: user._id
        })

        expect(res.status).toBe(403)
        expect(res.body).not.toBeNull()
        expect(res.body.issues[0].message).toBe("Only owner can perform this action")
      })
})