import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"
import { createAuthUser } from "../factories/user.factory"
import { createComment } from "../factories/comment.factory"


describe("GET /api/comment", () => {


    it("fails when user is not member of taskboard", async () => {
        const {user ,taskboard} = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)
        const {token} = await createAuthUser("test1")

        await Promise.all(
            Array.from( 
                { length: 4 }, (_, i) => createComment(userId, card._id.toString(), `text ${i}`)
             )
        )

        const body = 
            {
                _id: card._id.toString(),
            }
        
        const res = await request(app)
        .get("/api/comment")
        .set("Authorization", `Bearer ${token}`)
        .send(body)

        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")
        
    })

    
    it("should retrieve empty list form card", async () => {
        const {token, user ,taskboard} = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)

        const body = 
            {
                _id: card._id.toString(),
            }
        
        const res = await request(app)
        .get("/api/comment")
        .set("Authorization", `Bearer ${token}`)
        .send(body)
            
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(0)
        
    })

    it("should retrieve all comments form card", async () => {
        const {token, user ,taskboard} = await createTaskboard()
        const userId = user._id.toString()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const card = await createCard(list._id.toString(), userId)
        await Promise.all(
            Array.from( 
                { length: 4 }, (_, i) => createComment(userId, card._id.toString(), `text ${i}`)
             )
        )

        const body = 
            {
                _id: card._id.toString(),
            }
        
        const res = await request(app)
        .get("/api/comment")
        .set("Authorization", `Bearer ${token}`)
        .send(body)
            
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(4)
        
    })

})