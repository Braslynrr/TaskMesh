import request from "supertest"
import { SocketEvents } from "../../modules/Socket/socket.events"
import { getServer } from "../factories/server.factory"
import { AddMemberToTaskboard, createTaskboard } from "../factories/taskboard.factory"
import { createAuthUser, createUser } from "../factories/user.factory"
import { io as Client } from "socket.io-client"
import { Taskboard } from "src/modules/Taskboard/taskboard.types"



describe("Websocket for taskboard", () => {

    let server: any
    let port: number
    let socketToken: string
    let APIToken: string
    let taskboard: Taskboard
    let user: any


    beforeAll(async () => {
        server = getServer()

        await new Promise<void>((resolve) => {
            server.listen(() => {
                port = (server.address() as any).port
                resolve()
            })
        })

    })

    beforeEach(async () => {
        const result = await createTaskboard()
        user = await createAuthUser("test1")
        taskboard = await AddMemberToTaskboard(result.taskboard._id.toString(), [user.user._id])
        socketToken = user.token
        APIToken = result.token
    })


    it("should receive TASKBOARD_MEMBER when a user is added", async () => {

        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })

        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboard._id)

        const taskboardMembersPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.TASKBOARD_MEMBERS, (payload) => {
                resolve(payload)
            })
        })

        const userToAdd = await createUser("new User")

        const res = await request(server)
            .post("/api/taskboard/add")
            .set("Cookie", `auth_token=${APIToken}`)
            .send({
                _id: taskboard._id,
                members: [userToAdd.username]
            })

        expect(res.status).toBe(200)

        const payload = await taskboardMembersPromise

        const memeberIds = taskboard.members.map(m => ({ _id: m._id }))

        const expectedTaskboard = {
            ...taskboard, owner: {
                _id: taskboard.owner._id,
            }, members: [...memeberIds, { _id: userToAdd._id }]
        }

        expect(payload.taskboard).toMatchObject(expectedTaskboard)

    })



    it("should receive TASKBOARD_MEMBER when a user is removed", async () => {

        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })

        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboard._id)

        const taskboardMembersPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.TASKBOARD_MEMBERS, (payload) => {
                resolve(payload)
            })
        })

        const res = await request(server)
            .delete(`/api/taskboard/${taskboard._id}/member/${user.user._id}`)
            .set("Cookie", `auth_token=${APIToken}`)

        expect(res.status).toBe(200)

        const payload = await taskboardMembersPromise

        const expectedTaskboard = {
            ...taskboard, owner: {
                _id: taskboard.owner._id,
            }, members: []
        }

        expect(payload.taskboard).toMatchObject(expectedTaskboard)

    })

})