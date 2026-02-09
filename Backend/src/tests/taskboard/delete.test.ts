import request from "supertest"
import app from "../../app"
import { createAuthUser, createUser } from "../factories/user.factory"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"
import { createComment } from "../factories/comment.factory"
import { ListModel } from "../../modules/List/list.repository"
import { cardModel } from "../../modules/Card/card.repository"
import { commentModel } from "../../modules/Comment/comment.repository"

describe("DELETE /api/taskboard/", () => {

    it("should delete a taskboard", async () => {
        const { token, taskboard } = await createTaskboard()

        const res = await request(app)
            .delete(`/api/taskboard/${taskboard._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body).not.toBeNull()
        expect(res.body.deletedCount).toBe(1)
    })

    it("fails when _id does not exist", async () => {
        const { token } = await createTaskboard()

        const res = await request(app)
            .delete(`/api/taskboard/096b0abc98937822669a7c40`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(404)
        expect(res.body).not.toBeNull()
        expect(res.body.issues[0].message).toBe("taskboard was not found")
    })

    it("fails when user is not taskboard owner", async () => {
        const { taskboard } = await createTaskboard()
        const { token } = await createAuthUser("test1")

        const res = await request(app)
            .delete(`/api/taskboard/${taskboard._id}`)
            .set("Cookie", `auth_token=${token}`)
            .send({
                _id: taskboard._id,
            })

        expect(res.status).toBe(403)
        expect(res.body).not.toBeNull()
        expect(res.body.issues[0].message).toBe("only owner can perform this action")
    })

    it("should delete taskboard and cascade lists, cards and comments", async () => {
        const { token, user, taskboard } = await createTaskboard()
        const userId = user._id.toString()

        const list1 = await createListForTaskboard(taskboard._id.toString(), "L1", 1)
        const list2 = await createListForTaskboard(taskboard._id.toString(), "L2", 2)

        const card1 = await createCard(list1._id.toString(), userId)
        const card2 = await createCard(list2._id.toString(), userId)

        await createComment(userId, card1._id.toString())
        await createComment(userId, card2._id.toString())

        const res = await request(app)
            .delete(`/api/taskboard/${taskboard._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body.deletedCount).toBe(1)

        const lists = await ListModel.find({ taskboardId: taskboard._id })
        const cards = await cardModel.find({ listId: { $in: [list1._id, list2._id] } })
        const comments = await commentModel.find({ cardId: { $in: [card1._id, card2._id] } })

        expect(lists.length).toBe(0)
        expect(cards.length).toBe(0)
        expect(comments.length).toBe(0)
    })

})