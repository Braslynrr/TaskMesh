import { AddMemberToTaskboard, createTaskboard } from "../factories/taskboard.factory"
import { io as Client } from "socket.io-client"
import { SocketEvents } from "../../modules/Socket/socket.events"
import request from "supertest"
import { getServer } from "../factories/server.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { listResponse } from "../../modules/List/list.types"
import { createCard } from "../factories/card.factory"
import { createUser } from "../factories/user.factory"

describe("WebSocket for List", () => {
    let server: any
    let port: number
    let token: string
    let taskboardId: string
    let userId: string
    let lists: any[] = []

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
        token = result.token
        taskboardId = result.taskboard._id.toString()
        userId = result.user._id
        lists = [await createListForTaskboard(taskboardId, "test1"), await createListForTaskboard(taskboardId, "test2")]

    })

    afterAll((done) => {
        server.close()
        done()
    })


    it("should receive CARD_CREATED when a card is created", async () => {
        const client = Client(`http://localhost:${port}`)

        await new Promise<void>((resolve) => {
            client.on("connect", () => resolve())
        })

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const cardCreatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.CARD_CREATED, (payload) => {
                resolve(payload)
            })
        })

        const body =
        {
            listId: lists[0]._id.toString(),
            title: `test`,
            description: "test"
        }

        const res = await request(server)
            .post("/api/card/create")
            .set("Cookie", `auth_token=${token}`)
            .send(body)

        expect(res.status).toBe(201)

        const payload = await cardCreatedPromise

        expect(payload).toHaveProperty("card")
        expect(payload.card).toMatchObject(res.body)


        client.disconnect()
    })

    it("should receive CARD_UPDATED when a card is updated", async () => {

        const client = Client(`http://localhost:${port}`)

        await new Promise<void>((resolve) => {
            client.on("connect", () => resolve())
        })

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const cardUpdatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.CARD_UPDATED, (payload) => {
                resolve(payload)
            })
        })

        const card = await createCard(lists[0]._id.toString(), userId)

        const body =
        {
            _id: card.id.toString(),
            title: "new title",
            description: "new description"
        }

        const res = await request(server)
            .patch("/api/card")
            .set("Cookie", `auth_token=${token}`)
            .send(body)

        expect(res.status).toBe(200)

        const payload = await cardUpdatedPromise

        expect(payload).toHaveProperty("card")
        expect(payload.card).toMatchObject(body)

        client.disconnect()
    })


    it("should receive CARD_UPDATED when a card is assign", async () => {

        const client = Client(`http://localhost:${port}`)

        await new Promise<void>((resolve) => {
            client.on("connect", () => resolve())
        })

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const cardUpdatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.CARD_UPDATED, (payload) => {
                resolve(payload)
            })
        })

        const card = await createCard(lists[0]._id.toString(), userId)
        const user = await createUser("User for testing")
        AddMemberToTaskboard(taskboardId, [user._id.toString()])


        const res = await request(server)
            .post("/api/card/assign")
            .set("Cookie", `auth_token=${token}`)
            .send(
                {
                    _id: card._id.toString(),
                    assignedTo: [user._id.toString()]
                })

        expect(res.status).toBe(200)

        const payload = await cardUpdatedPromise

        expect(payload).toHaveProperty("card")
        expect(payload.card).toMatchObject({ _id:card._id.toString() , assignedTo: [{ username: user.username }] })

        client.disconnect()
    })

    it("should receive CARD_MOVED when a card is moved", async () => {

        const client = Client(`http://localhost:${port}`)

        await new Promise<void>((resolve) => {
            client.on("connect", () => resolve())
        })

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const cardMovedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.CARD_MOVED, (payload) => {
                resolve(payload)
            })
        })

        const card = await createCard(lists[0]._id.toString(), userId)

        const res = await request(server)
            .post("/api/card/move")
            .set("Cookie", `auth_token=${token}`)
            .send(
                {
                    _id: card._id.toString(),
                    listId: lists[1]._id.toString()
                })

        expect(res.status).toBe(200)

        const payload = await cardMovedPromise

        expect(payload).toMatchObject({ cardId: card._id.toString(), to: lists[1]._id.toString() })

        client.disconnect()
    })

    it("should receive CARD_DELETED when a card is deleted", async () => {

        const client = Client(`http://localhost:${port}`)

        await new Promise<void>((resolve) => {
            client.on("connect", () => resolve())
        })

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const cardDeletedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.CARD_DELETED, (payload) => {
                resolve(payload)
            })
        })

        const card = await createCard(lists[0]._id.toString(), userId)

        const res = await request(server)
            .delete(`/api/card/${card._id}`)
            .set("Cookie", `auth_token=${token}`)

        expect(res.status).toBe(200)

        const payload = await cardDeletedPromise

        expect(payload).toMatchObject({ cardId: card._id.toString() })

        client.disconnect()
    })


})