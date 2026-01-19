import request from "supertest"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListToTaskboard } from "../factories/list.factory"
import app from "../../app"
import { createAuthUser } from "../factories/user.factory"

describe("Post /api/list/move", () => {

    it("move list to 2nd position", async () => {
        const {token, taskboard} = await createTaskboard()
        const lists = await Promise.all(
                    Array.from({ length: 4 }, (_, i) => 
                        createListToTaskboard(taskboard._id.toString(), `t${i + 1}`, i + 1)))



       const res = await request(app)
       .post("/api/list/move")
       .set("Authorization", `Bearer ${token}`)
       .send({
            _id: lists[3]._id,
            taskboardId: taskboard._id.toString(),
            position: 2
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(4)
        expect(res.body[1]).toMatchObject({
            position:2,
            title: "t4"
        })

        expect(res.body[2]).toMatchObject({
            position:3,
            title: "t2"
        })

    })

    it("move list to 1st position", async () => {
        const {token, taskboard} = await createTaskboard()
        const lists = await Promise.all(
                    Array.from({ length: 4 }, (_, i) => 
                        createListToTaskboard(taskboard._id.toString(), `t${i + 1}`, i + 1)))

       const res = await request(app)
       .post("/api/list/move")
       .set("Authorization", `Bearer ${token}`)
       .send({
            _id: lists[3]._id,
            taskboardId: taskboard._id.toString(),
            position: 1
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(4)
        expect(res.body[0]).toMatchObject({
            position:1,
            title: "t4"
        })

        expect(res.body[1]).toMatchObject({
            position:2,
            title: "t1"
        })
    })

    it("move list that not exist", async () => {
        const {token, taskboard} = await createTaskboard()

        const res = await request(app)
        .post("/api/list/move")
        .set("Authorization", `Bearer ${token}`)
        .send({
             _id: "096b0abc98937822669a7c41",
             taskboardId: taskboard._id.toString(),
             position: 1
        })

        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("The moved list does not exist")
    })

    
    it("move list in taskboard that does not exist", async () => {
        const {token} = await createTaskboard()

        const res = await request(app)
        .post("/api/list/move")
        .set("Authorization", `Bearer ${token}`)
        .send({
             _id: "096b0abc98937822669a7c40",
             taskboardId: "096b0abc98937822669a7c41",
             position: 1
        })

        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("Taskboard does not exist")
    })

    it("fails when user is not in taskboard", async () => {
        const {token} = await createAuthUser("test1")
        const {taskboard} = await createTaskboard()

        const res = await request(app)
        .post("/api/list/move")
        .set("Authorization", `Bearer ${token}`)
        .send({
             _id: "096b0abc98937822669a7c40",
             taskboardId: taskboard._id.toString(),
             position: 1
        })

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("User is not a member of this taskboard")
    })
})