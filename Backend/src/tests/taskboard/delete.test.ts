import request from "supertest"
import app from "../../app"
import { createAuthUser, createUser } from "../factories/user.factory"
import { createTaskboard } from "../factories/taskboard.factory"

describe("DELETE /api/taskboard/", () => {

    it("should delete a taskboard", async () => {
        const {token, taskboard} = await createTaskboard()

        const res = await request(app)
        .delete("/api/taskboard/")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: taskboard._id,
        })

        expect(res.status).toBe(200)
        expect(res.body).not.toBeNull()
        expect(res.body.deletedCount).toBe(1)
    })

    it("fails when _id does not exist", async () => {
        const {token} = await createTaskboard()

        const res = await request(app)
        .delete("/api/taskboard/")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: "096b0abc98937822669a7c40",
        })

        expect(res.status).toBe(404)
        expect(res.body).not.toBeNull()
        expect(res.body.issues[0].message).toBe("Taskboard was not found")
    })

     it("fails when user is not taskboard owner", async () => {
        const {taskboard} = await createTaskboard()
        const {token} = await createAuthUser("test1")

        const res = await request(app)
        .delete("/api/taskboard/")
        .set("Authorization", `Bearer ${token}`)
        .send({
            _id: taskboard._id,
        })

        expect(res.status).toBe(403)
        expect(res.body).not.toBeNull()
        expect(res.body.issues[0].message).toBe("Only owner can perform this action")
    })

})