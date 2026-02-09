import request from "supertest"
import app from "../../app"
import { createCard } from "../factories/card.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createTaskboard } from "../factories/taskboard.factory"
import { createAuthUser } from "../factories/user.factory"
import { createComment } from "../factories/comment.factory"
import { commentModel } from "../../modules/Comment/comment.repository"


describe("DELETE /api/card", () => {


    it("fails when card id does not exist", async () => {
        const { token, user, taskboard } = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)

        const res = await request(app)
            .delete(`/api/card/096b0abc98937822669a7c40`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("card does not exist")

    })


    it("fails when external user tries to delete", async () => {
        const { user, taskboard } = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId = list._id.toString()
        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) =>
                createCard(listId, user._id.toString(), `test${i}`, `test${i}`)))
        const { token } = await createAuthUser("test1")


        const res = await request(app)
            .delete(`/api/card/${cardList[0]._id.toString()}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user cannot perform this action")

    })


    it("should delete a card", async () => {
        const { token, user, taskboard } = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId = list._id.toString()
        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) =>
                createCard(listId, user._id.toString(), `test${i}`, `test${i}`)))


        const res = await request(app)
            .delete(`/api/card/${cardList[0]._id.toString()}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject(
            {
                acknowledged: true,
                deletedCount: 1
            })

    })

    it("should delete card and cascade comments", async () => {
        const { token, user, taskboard } = await createTaskboard()
        const userId = user._id.toString()

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)

        const comment1 = await createComment(userId, card._id.toString())
        const comment2 = await createComment(userId, card._id.toString())

        const res = await request(app)
            .delete(`/api/card/${card._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body.deletedCount).toBe(1)

        const comments = await commentModel.find({ cardId: card._id })
        expect(comments.length).toBe(0)
    })

})