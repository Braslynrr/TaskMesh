import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createCard } from "../factories/card.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createAuthUser } from "../factories/user.factory"


describe("PATCH /api/card", () => {

    it("fails when user is external", async () => {
        const {user, taskboard} = await createTaskboard()
        const {token} = await createAuthUser("test1")

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()

        const card = await createCard(listId, user._id.toString())
        
        const body = 
        {
            _id: card.id.toString(),
            title: "test2",
            description: "test2"
        }

        const res = await request(app)
        .patch("/api/card")
        .set("Authorization", `Bearer ${token}`)
        .send(body)
            
        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user cannot perform this action")        
    })
    
    it("should update cards text fields", async () => {
        const {token, user, taskboard} = await createTaskboard()

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()

        const card = await createCard(listId, user._id.toString())
        
        const body = 
        {
            _id: card.id.toString(),
            title: "test2",
            description: "test2"
        }

        const res = await request(app)
        .patch("/api/card")
        .set("Authorization", `Bearer ${token}`)
        .send(body)
            
        expect(res.status).toBe(200)

        expect(res.body).toMatchObject(body)
        
    })

})