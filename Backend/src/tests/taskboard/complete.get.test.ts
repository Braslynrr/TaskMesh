import request from "supertest"
import app from "../../app"
import { createAuthUser } from "../factories/user.factory"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"
import { createComment } from "../factories/comment.factory"

describe("GET /api/taskboard/:id/snapshot", () => {

    it("fails if user is not member of the taskboard", async () => {

        const { taskboard } = await createTaskboard()
        const { token } = await createAuthUser("test1")

        const res = await request(app)
            .get(`/api/taskboard/${taskboard._id}/snapshot`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")

    })

    it("retrieves a complete taskboard snapshot", async () => {
        const { token, user, taskboard } = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)
        await createComment(userId, card._id.toString())

        const res = await request(app)
            .get(`/api/taskboard/${taskboard._id}/snapshot`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
            _id: taskboard._id.toString(),
            name: taskboard.name,
            owner: { username: user.username },
            lists: [{ _id: list._id.toString() , title: list.title }],
            cards: [{ createdBy: {username: user.username}, title: card.title, listId: list._id.toString(), comments: 1 }]
        })
        
    })

})