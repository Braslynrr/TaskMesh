import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"
import { createAuthUser } from "../factories/user.factory"
import { createComment } from "../factories/comment.factory"


describe("PATCH /api/comment", () => {


    it("fails when user is not member of taskboard", async () => {
        const {user ,taskboard} = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)
        const comment = await createComment(userId, card._id.toString())
        const {token} = await createAuthUser("test1")

        const body = 
            {
                _id: comment._id.toString(),
                text: "New text"
            }
        
        const res = await request(app)
        .patch("/api/comment")
        .set("Authorization", `Bearer ${token}`)
        .send(body)
            
        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user cannot perform this action")
        
    })

    it("should allow author user to update its comment", async () => {
        const {user ,taskboard} = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const user2 = await createAuthUser("test1")
        const user2Id = user2.user._id.toString()
        const card = await createCard(list._id.toString(), userId, "test", "test", [user2Id])
        const comment = await createComment(user2Id, card._id.toString())

        const body = 
            {
                _id: comment._id.toString(),
                text: "New text"
            }
        
        const res = await request(app)
        .patch("/api/comment")
        .set("Authorization", `Bearer ${user2.token}`)
        .send(body)
            
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject(body)
        
    })
    
    it("should update a comment", async () => {
        const {token, user ,taskboard} = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)
        const comment = await createComment(userId, card._id.toString())

        const body = 
            {
                _id: comment._id.toString(),
                text: "New text"
            }
        
        const res = await request(app)
        .patch("/api/comment")
        .set("Authorization", `Bearer ${token}`)
        .send(body)
            
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject(body)
        
    })

})