import request from "supertest"
import app from "../../app"
import { createListToTaskboard } from "../factories/list.factory"
import { createTaskboard } from "../factories/taskboard.factory"
import { createAuthUser } from "../factories/user.factory"


describe("DELETE /api/list/", () => {

    it("should delete a list", async () => {
        const {token, taskboard} = await createTaskboard()
        const list = await createListToTaskboard(taskboard._id.toString())

        const res = await request(app)
        .delete("/api/list")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: list._id.toString(),
            taskboardId: taskboard._id.toString()
        })

        expect(res.status).toBe(200)
        expect(res.body).not.toBeNull()
        expect(res.body.deletedCount).toBe(1)
    })

    it("fails when taskboard ID doesn't exist", async () => {
        const {token, taskboard} = await createTaskboard()
        const list = await createListToTaskboard(taskboard._id.toString())

        const res = await request(app)
        .delete("/api/list")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: list._id.toString(),
            taskboardId: "096b0abc98937822669a7c40"
        })

        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("Taskboard does not exist")
    })

    it("fails when user is not in taskboard", async () => {
        const {taskboard} = await createTaskboard()
        const list = await createListToTaskboard(taskboard._id.toString())
        const {token} = await createAuthUser("test1")
    
        const res = await request(app)
        .delete("/api/list")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: list._id.toString(),
            taskboardId: taskboard._id.toString()
        })
    
        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("User is not a member of this taskboard")
    
    })
})