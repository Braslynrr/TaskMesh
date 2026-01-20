import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard as createListforTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"
import { createAuthUser } from "../factories/user.factory"


describe("POST /api/card/move", () => {

    it("fails when user its not member of the taskboard", async () => {
        const { user, taskboard} = await createTaskboard()
        const list = await createListforTaskboard(taskboard._id.toString(), "test", 1)
        const list2 = await createListforTaskboard(taskboard._id.toString(), "test", 2)

        const {token} = await createAuthUser("test1")

        const listId = list._id.toString()
        const listId2 = list2._id.toString()

        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId, user._id.toString(), `test${i}`,`test${i}`)))

        
        const res = await request(app)
        .post("/api/card/move")
        .set("Authorization", `Bearer ${token}`)
        .send(
            {
                _id: cardList[0]._id.toString(),
                listId: listId2
            })
            
        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user cannot perform this action")
    })

    it("fails when the other list does not exist", async () => {
        const {token, user, taskboard} = await createTaskboard()
        const list = await createListforTaskboard(taskboard._id.toString(), "test", 1)

        const listId = list._id.toString()

        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId, user._id.toString(),`test${i}`,`test${i}`)))

        
        const res = await request(app)
        .post("/api/card/move")
        .set("Authorization", `Bearer ${token}`)
        .send(
            {
                _id: cardList[0]._id.toString(),
                listId: "096b0abc98937822669a7c40"
            })
            
        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("the given list does not exist")
    })


    it("fails when list belong to different taskboard", async () => {
        const {token, user, taskboard} = await createTaskboard()
        const taskboard2 = await createTaskboard("test1", "test1")
        const list = await createListforTaskboard(taskboard._id.toString(), "test", 1)
        const list2 = await createListforTaskboard(taskboard2.taskboard._id.toString(), "test", 2)

        const listId = list._id.toString()
        const listId2 = list2._id.toString()

        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId, user._id.toString(), `test${i}`,`test${i}`)))

        
        const res = await request(app)
        .post("/api/card/move")
        .set("Authorization", `Bearer ${token}`)
        .send(
            {
                _id: cardList[0]._id.toString(),
                listId: listId2
            })
            
        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("the lists do not belong to the same taskboard")
    })
    
    it("should move a list to other list", async () => {
        const {token, user, taskboard} = await createTaskboard()
        const list = await createListforTaskboard(taskboard._id.toString(), "test", 1)
        const list2 = await createListforTaskboard(taskboard._id.toString(), "test", 2)

        const listId = list._id.toString()
        const listId2 = list2._id.toString()

        const cardList = await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId, user._id.toString(), `test${i}`,`test${i}`)))

        
        const res = await request(app)
        .post("/api/card/move")
        .set("Authorization", `Bearer ${token}`)
        .send(
            {
                _id: cardList[0]._id.toString(),
                listId: listId2
            })
            
        expect(res.status).toBe(200)
        expect(res.body.listId).toBe(listId2)
    })

})