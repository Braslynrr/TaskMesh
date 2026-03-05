import { AddMemberToTaskboard, createTaskboard } from "../factories/taskboard.factory"
import { io as Client } from "socket.io-client"
import request from "supertest"
import { getServer } from "../factories/server.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { createAuthUser } from "../factories/user.factory"
import { SocketEvents } from "../../modules/Socket/socket.events"

describe("WebSocket for List", () => {
    let server: any
    let port: number
    let socketToken: string
    let APIToken: string
    let taskboardId: string

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
        const user = await createAuthUser("test1")
        await AddMemberToTaskboard(result.taskboard._id.toString(), [user.user._id])
        socketToken = user.token
        APIToken = result.token
        taskboardId = result.taskboard._id.toString()
    })

    afterAll((done) => {
        server.close()
        done()
    })


    it("should receive LIST_CREATED when a list is created", async () => {
        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })

        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const listCreatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.LIST_CREATED, (payload) => {
                resolve(payload)
            })
        })

        const res = await request(server)
            .post("/api/list/create")
            .set("Cookie", `auth_token=${APIToken}`)
            .send({
                title: "test",
                taskboardId: taskboardId
            })

        expect(res.status).toBe(201)

        const payload = await listCreatedPromise

        expect(payload).toHaveProperty("list")
        expect(payload.list).toMatchObject(res.body)

        client.disconnect()
    })

    it("should receive LIST_UPDATED when a list is updated", async () => {

        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })

        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const listUpdatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.LIST_UPDATED, (payload) => {
                resolve(payload)
            })
        })

        const list = await createListForTaskboard(taskboardId)

        const body = {
            _id: list._id.toString(),
            title: "New Title"
        }

        const res = await request(server)
            .patch(`/api/list/`)
            .set("Cookie", `auth_token=${APIToken}`)
            .send(body)

        expect(res.status).toBe(200)

        const payload = await listUpdatedPromise

        expect(payload).toHaveProperty("list")
        expect(payload.list).toMatchObject(res.body)

        client.disconnect()
    })

    it("should receive LIST_MOVED when a list is moved", async () => {

        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })


        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const listMovedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.LIST_MOVED, (payload) => {
                resolve(payload)
            })
        })

        const list1 = await createListForTaskboard(taskboardId)

        const list2 = await createListForTaskboard(taskboardId)

        const res = await request(server)
            .post("/api/list/move")
            .set("Cookie", `auth_token=${APIToken}`)
            .send({
                _id: list2._id,
                taskboardId: list1.taskboardId,
                position: 1
            })

        expect(res.status).toBe(200)

        const payload = await listMovedPromise


        expect(payload).toMatchObject({
            from: 2,
            to: 1,
            listId: list2._id.toString()
        })

        client.disconnect()
    })

    it("should receive LIST_DELETED when a list is deleted", async () => {

        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })

        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const listDeletedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.LIST_DELETED, (payload) => {
                resolve(payload)
            })
        })

        const list1 = await createListForTaskboard(taskboardId)

        const res = await request(server)
            .delete(`/api/list/${list1._id}`)
            .set("Cookie", `auth_token=${APIToken}`)


        expect(res.status).toBe(200)

        const payload = await listDeletedPromise


        expect(payload).toMatchObject({
            listId: list1._id.toString()
        })

        client.disconnect()
    })


})