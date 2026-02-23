import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createAuthUser } from "../factories/user.factory"


describe("PATCH /api/list/", () => {


    it("fails when list does not exist", async () => {
        const {token, taskboard } = await createTaskboard()

        await createListForTaskboard(taskboard._id.toString())

        const body = {
            _id: "096b0abc98937822669a7c41",
            title: "New Title"
        }

        const res = await request(app)
            .patch(`/api/list/`)
            .set("Cookie", `auth_token=${token}`)
            .send(body)

        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("list does not exist")
    })

    it("fails when non member tries to update title", async () => {
        const {taskboard } = await createTaskboard()
        const {token} = await  createAuthUser("test1")

        const list = await createListForTaskboard(taskboard._id.toString())

        const body = {
            _id: list._id.toString(),
            title: "New Title"
        }

        const res = await request(app)
            .patch(`/api/list/`)
            .set("Cookie", `auth_token=${token}`)
            .send(body)

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")
    })


    it("updates list title", async () => {
        const { token, taskboard } = await createTaskboard()

        const list = await createListForTaskboard(taskboard._id.toString())

        const body = {
            _id: list._id.toString(),
            title: "New Title"
        }

        const res = await request(app)
            .patch(`/api/list/`)
            .set("Cookie", `auth_token=${token}`)
            .send(body)

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject(body)
    })

})