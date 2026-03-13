import { Server } from "socket.io";

import { getLogger } from "../../core/logger/logger";
import { getConfig } from "../../core/config/config";
import jwt from "jsonwebtoken"
import { ClientToServerEvents, ServerToClientEvents } from "./socket.types";
import { SocketEvents } from "./socket.events";
import { Taskboard } from "../Taskboard/taskboard.types";
import { taskboardService } from "../Taskboard/taskboard.service";

let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null


export function initSocket(httpServer: any = null, cors: string = "*") {
    if (!io && httpServer) {
        io = new Server(httpServer,
            {
                cors: {
                    origin: cors,
                    credentials: true
                },
                pingInterval: 10000,
                pingTimeout: 5000
            }
        )

        io.use((socket, next) => {
            try {
                const token =
                    socket.handshake.auth?.token ||
                    socket.handshake.headers.cookie
                        ?.split("; ")
                        .find(c => c.startsWith("auth_token="))
                        ?.split("=")[1]

                if (!token) {
                    return next(new Error("Unauthorized"))
                }

                const config = getConfig()
                const payload = jwt.verify(token, config.jwt.secret.value) as { _id: string }

                socket.data.user = { _id: payload._id }

                next()
            } catch (err) {
                next(new Error("Invalid or expired token"))
            }
        })

        handlingEvents()
    }
}

function handlingEvents() {
    const logger = getLogger()
    io.on(SocketEvents.CONNECTION, (socket) => {

        const userId = socket.data.user._id
        const userRoom = `${SocketEvents.USER}:${userId}`
        socket.join(userRoom)

        logger.info(`Socket connection detected: ${socket.id} from ${userId}`)

        socket.on(SocketEvents.JOIN_TASKBOARD, async (taskboardId: string) => {
            const taskboardRoom = `${SocketEvents.TASKBOARD}:${taskboardId}`
            socket.join(taskboardRoom)
            socket.emit(SocketEvents.JOINED_TASKBOARD, { taskboardId: taskboardId })
            logger.info(`Joining taskboard: ${taskboardId}`)

            const taskboard = await getConnectedMembers(taskboardId, userId)
            io.to(taskboardRoom).emit(SocketEvents.TASKBOARD_MEMBERS, { taskboard, authorId: userId })
        })

        socket.on(SocketEvents.LEAVE_TASKBOARD, async (taskboardId: string) => {
            const taskboardRoom = `${SocketEvents.TASKBOARD}:${taskboardId}`
            socket.leave(taskboardRoom)
            socket.leave(userRoom)
            logger.info(`${userId} is leaving taskboard: ${taskboardId}`)

            const taskboard = await getConnectedMembers(taskboardId, userId)
            io.to(taskboardRoom).emit(SocketEvents.TASKBOARD_MEMBERS, { taskboard, authorId: userId })
        })

        socket.on(SocketEvents.DISCONECTION, async () => {

            for (const room of socket.rooms) {

                const splitName = room.split(":")

                if (splitName[0] === SocketEvents.TASKBOARD) {

                    const taskboardId = splitName[1]
                    const taskboardRoom = room

                    logger.info(`${userId} disconnecting from taskboard: ${taskboardId}`)

                    const taskboard = await getConnectedMembers(taskboardId, userId)

                    if (taskboard) {
                        io.to(taskboardRoom).emit(
                            SocketEvents.TASKBOARD_MEMBERS,
                            { taskboard, authorId: userId }
                        )
                    }
                }
            }

        })

    })
}

export function getIO() {

    if (!io) {
        throw new Error("Socket.io not initialized")
    }
    return io
}


export function boardEmitter(
    taskboardId: string,
    userId: string
) {
    const room = `${SocketEvents.TASKBOARD}:${taskboardId}`
    const user = `${SocketEvents.USER}:${userId}`
    const io = getIO()
    if (io)
        return io.to(room).except(user)
    return null
}

async function getConnectedMembers(taskboardId: string, userID: string): Promise<Taskboard> {

    const taskboard = await taskboardService.getTaskboard(taskboardId, userID)

    if (taskboard) {
        const connectedTaskboard = await taskboardService.getConnectedUsers([taskboard])

        return connectedTaskboard[0]

    }

    return null
}