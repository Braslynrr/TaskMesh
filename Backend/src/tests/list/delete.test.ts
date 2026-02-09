import request from "supertest"
import app from "../../app"
import { createListForTaskboard } from "../factories/list.factory"
import { createTaskboard } from "../factories/taskboard.factory"
import { createAuthUser } from "../factories/user.factory"
import { createCard } from "../factories/card.factory"
import { createComment } from "../factories/comment.factory"
import { cardModel } from "../../modules/Card/card.repository"
import { commentModel } from "../../modules/Comment/comment.repository"


describe("DELETE /api/list/", () => {

    it("fails when list ID doesn't exist", async () => {
        const { token, taskboard } = await createTaskboard()
        await createListForTaskboard(taskboard._id.toString())

        const res = await request(app)
            .delete(`/api/list/096b0abc98937822669a7c41`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("list does not exist")
    })

    it("fails when user is not in taskboard", async () => {
        const { taskboard } = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString())
        const { token } = await createAuthUser("test1")

        const res = await request(app)
            .delete(`/api/list/${list._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")

    })

    it("should delete a list", async () => {
        const { token, taskboard } = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString())

        const res = await request(app)
            .delete(`/api/list/${list._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body).not.toBeNull()
        expect(res.body.deletedCount).toBe(1)
    })

    it("should delete list and cascade cards and comments", async () => {
        const { token, user, taskboard } = await createTaskboard()
        const userId = user._id.toString()

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)

        const card1 = await createCard(list._id.toString(), userId)
        const card2 = await createCard(list._id.toString(), userId)

        await createComment(userId, card1._id.toString())
        await createComment(userId, card2._id.toString())

        const res = await request(app)
            .delete(`/api/list/${list._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body.deletedCount).toBe(1)

        const cards = await cardModel.find({ listId: list._id })
        const comments = await commentModel.find({ cardId: { $in: [card1._id, card2._id] } })

        expect(cards.length).toBe(0)
        expect(comments.length).toBe(0)
    })
})