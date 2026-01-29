import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard as createListforTaskboard } from "../factories/list.factory"
import { createCard } from "../factories/card.factory"


describe("GET /api/card", () => {

    it("should retrieve empty list", async () => {
        const {token, user, taskboard} = await createTaskboard()
        const list = await createListforTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()
        await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId, user._id.toString(), `test${i}`,`test${i}`)))

        
        const res = await request(app)
        .get(`/api/card/096b0abc98937822669a7c40`)
        .set("Cookie", `auth_token=${token}`)
        .send(
            {
                _id: "096b0abc98937822669a7c40",
            })
            
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(0)
        
    })
    
    it("should retrieve all list cards", async () => {
        const {token, user, taskboard} = await createTaskboard()
        const list = await createListforTaskboard(taskboard._id.toString(), "test", 1)
        const listId= list._id.toString()
        await Promise.all(
            Array.from({ length: 4 }, (_, i) => 
                createCard(listId, user._id.toString(), `test${i}`,`test${i}`)))

        
        const res = await request(app)
         .get(`/api/card/${list._id.toString()}`)
        .set("Cookie", `auth_token=${token}`)
            
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(4)
        
    })

})