import request from "supertest"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import app from "../../app"
import { createAuthUser } from "../factories/user.factory"

describe("GET /api/list/", () => {
    it("retrieve all lists from a taskboard", async () => {
        const {token, taskboard} = await createTaskboard()
        await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createListForTaskboard(taskboard._id.toString(), `t${i + 1}`, i + 1)))

       const res = await request(app)
       .get("/api/list")
       .set("Cookie", `auth_token=${token}`)
       .send({
            taskboardId: taskboard._id.toString()
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(4)
    })


    it("retrieve an empty array", async () => {
        const {token, taskboard} = await createTaskboard()

        const res = await request(app)
        .get("/api/list")
        .set("Cookie", `auth_token=${token}`)
        .send({
            taskboardId: taskboard._id.toString()
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(0)
    })

    it("fails when user is not in taskboard", async () => {
        const {token} = await createAuthUser("test1")
        const {taskboard} = await createTaskboard()

        const res = await request(app)
        .get("/api/list")
        .set("Cookie", `auth_token=${token}`)
        .send({
            taskboardId: taskboard._id.toString()
        })

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")
    })

})