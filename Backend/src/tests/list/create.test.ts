import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createAuthUser } from "../factories/user.factory"


describe("POST /api/list/create", () => {
    
    it("should create a few list", async () => {
        const {token, taskboard} = await createTaskboard()

        for(let i=1; i<4; i++){
            const res = await request(app)
            .post("/api/list/create")
            .set("Cookie", `auth_token=${token}`)
            .send(
                {
                    title: `test${i}`,
                    taskboardId: taskboard._id.toString()
                })
                
            expect(res.status).toBe(201)
            expect(res.body).toMatchObject({
                title: `test${i}`,
                taskboardId: taskboard._id.toString(),
                position: i
            })
        }
    })


   it("fails when taskboard ID doesn't exist", async () => {
    const {token, taskboard} = await createTaskboard()

    const res = await request(app)
      .post("/api/list/create")
      .set("Cookie", `auth_token=${token}`)
      .send({
        title: "test",
        taskboardId: "096b0abc98937822669a7c40",
      })

    expect(res.status).toBe(404)
    expect(res.body.issues[0].message).toBe("assigned taskboard does not exist")

  })


    it("fails when user is not in taskboard", async () => {
    const {taskboard} = await createTaskboard()
    const {token} = await createAuthUser("test1")

    const res = await request(app)
      .post("/api/list/create")
      .set("Cookie", `auth_token=${token}`)
      .send({
        title: "test",
        taskboardId: taskboard._id.toString()
      })

    expect(res.status).toBe(403)
    expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")

  })

})