import request from "supertest"
import { CardResponse } from "src/modules/Card/card.types"
import { createCard } from "../factories/card.factory"
import { createListForTaskboard } from "../factories/list.factory"
import { getServer } from "../factories/server.factory"
import { AddMemberToTaskboard, createTaskboard } from "../factories/taskboard.factory"
import { createAuthUser } from "../factories/user.factory"
import { createComment } from "../factories/comment.factory"
import { CommentResponse } from "src/modules/Comment/comment.types"
import { SocketEvents } from "../../modules/Socket/socket.events"
import { io as Client } from "socket.io-client"


describe("Websocket for comments", () => {

    let server: any
    let port: number
    let socketToken: string
    let APIToken: string
    let taskboardId: string
    let card: CardResponse
    let comment: CommentResponse

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
        const list = await createListForTaskboard(taskboardId, "test1")
        card = await createCard(list._id, result.user._id)
        comment = await createComment(result.user._id, card._id)
    })


    it("should receive COMMENT_CREATED when a user is created ", async () => {
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

        const commentCreatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.COMMENT_CREATED, (payload) => {
                resolve(payload)
            })
        })

        const body =
        {
            cardId: card._id.toString(),
            text: `test`,
        }

        const res = await request(server)
            .post("/api/comment")
            .set("Cookie", `auth_token=${APIToken}`)
            .send(body)

        expect(res.status).toBe(201)

        const payload = await commentCreatedPromise

        expect(payload).toMatchObject({ cardId: card._id })
    })

    it("should receive COMMENT_DELETED when a user is deleted ", async () => {

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

        const commentDeletedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.COMMENT_DELETED, (payload) => {
                resolve(payload)
            })
        })

        const res = await request(server)
            .delete(`/api/comment/${comment._id.toString()}`)
            .set("Cookie", `auth_token=${APIToken}`)

        expect(res.status).toBe(200)

        const payload = await commentDeletedPromise

        expect(payload).toMatchObject({ cardId: card._id })

    })

    it("should receive COMMENT_UPDATED when a user is updated ", async () => {
        const client = Client(`http://localhost:${port}`, {
            auth: {
                token: socketToken,
            }
        })

        await new Promise<void>((resolve) => {
            client.on(SocketEvents.CONNECT, async () => resolve())
        })

        expect(client.connected).toBe(true)

        client.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

        const commentUpdatedPromise = new Promise<any>((resolve) => {
            client.on(SocketEvents.COMMENT_UPDATED, (payload) => {
                resolve(payload)
            })
        })

        const body =
        {
            _id: comment._id,
            text: "New text"
        }

        const res = await request(server)
            .patch("/api/comment")
            .set("Cookie", `auth_token=${APIToken}`)
            .send(body)


        expect(res.status).toBe(200)

        const payload = await commentUpdatedPromise

        expect(payload).toMatchObject({ cardId: card._id })

    })

})