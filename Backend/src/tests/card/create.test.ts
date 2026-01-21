import request from "supertest"
import app from "../../app"
import { createTaskboard } from "../factories/taskboard.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createAuthUser } from "../factories/user.factory"


describe("POST /api/card/create", () => {

        it("fails when user is not member of the taskboard", async () => {
        const {taskboard} = await createTaskboard()
        const {token} =  await createAuthUser("test1")
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)

        
        const res = await request(app)
        .post("/api/card/create")
        .set("Cookie", `auth_token=${token}`)
        .send(
            {
                listId: list._id.toString(),
                title: `test`,
                description: "test"
            })
            
        expect(res.status).toBe(403)
        expect(res.body.issues[0].message).toBe("user is not a member of this taskboard")
        
    })

    it("fails when create a card with invalid listId", async () => {
        const {token, taskboard} = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)

        
        const res = await request(app)
        .post("/api/card/create")
        .set("Cookie", `auth_token=${token}`)
        .send(
            {
                listId: "096b0abc98937822669a7c40",
                title: `test`,
                description: "test"
            })
            
        expect(res.status).toBe(404)
        expect(res.body.issues[0].message).toBe("list does not exist")
        
    })

    
    it("should create a card", async () => {
        const {token, taskboard} = await createTaskboard()
        const list = await createListForTaskboard(taskboard._id.toString(), "test", 1)

        const body = 
            {
                listId: list._id.toString(),
                title: `test`,
                description: "test"
            }
        
        const res = await request(app)
        .post("/api/card/create")
        .set("Cookie", `auth_token=${token}`)
        .send(body)
            
        expect(res.status).toBe(201)
        expect(res.body).toMatchObject(body)
        
    })

})