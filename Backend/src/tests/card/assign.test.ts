import request from "supertest"
import app from "../../app"
import { createTaskboard, createTaskboardWithMembers } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"
import { createAuthUser, createUser } from "../factories/user.factory"


describe("POST /api/card/assign", () => {

    it("fails when users are assigned and they are not member of taskboard", async () => {
        const {token, user, taskboard} = await createTaskboard()
        
        const userList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createUser(`${i}`)))

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()

        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId,  user._id.toString(), `test${i}`, `test${i}`)))

        
        for(let i in cardList){
            const res = await request(app)
            .post("/api/card/assign")
            .set("Authorization", `Bearer ${token}`)
            .send(
            {
                _id: cardList[i]._id.toString(),
                assignedTo: [userList[i]._id.toString()]
            })

            expect(res.status).toBe(403)
            expect(res.body.issues[0].message).toBe(`the following users are not members of this taskboard: ${userList[i]._id}`)
        }
        
    })

    it("fails when non taskboard owner try to assign", async () => {

        const {token, user} = await createAuthUser("test1")
        const userId = user._id.toString()
        const {taskboard} = await createTaskboardWithMembers([userId])

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()

        const card = await createCard(listId, userId)
 
        const res = await request(app)
        .post("/api/card/assign")
        .set("Authorization", `Bearer ${token}`)
        .send(
        {
            _id: card._id.toString(),
            assignedTo: [userId]
        })

        expect(res.status).toBe(403)    
        expect(res.body.issues[0].message).toBe("only owner can perform this action")
    })

    it("should assign users to a card", async () => {
        const userList = await Promise.all(
        Array.from({ length: 4 }, (_, i) => 
                createUser(`${i}`)))

        const {token, user, taskboard} = await createTaskboardWithMembers(userList.map(user=> user._id.toString()))
        

        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()

        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId,  user._id.toString(), `test${i}`, `test${i}`)))

        
        for(let i in cardList){
            const userid = userList[i]._id.toString()
            const res = await request(app)
            .post("/api/card/assign")
            .set("Authorization", `Bearer ${token}`)
            .send(
            {
                _id: cardList[i]._id.toString(),
                assignedTo: [userid]
            })

            expect(res.status).toBe(200)
            expect(res.body.assignedTo).toContain(userid)
        }
    })

})