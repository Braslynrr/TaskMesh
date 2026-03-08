import { Server } from "socket.io";

import { getLogger } from "../../core/logger/logger";
import { getConfig } from "../../core/config/config";
import jwt from "jsonwebtoken"
import { ClientToServerEvents, ServerToClientEvents } from "./socket.types";
import { SocketEvents } from "./socket.events";

let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null


export function initSocket(httpServer: any = null, cors: string = "*") {
    if (!io && httpServer) {
        io = new Server(httpServer,
            {
                cors: {
                    origin: cors,
                    credentials: true
                }
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
        socket.join(`user:${userId}`)

        logger.info(`Socket connection detected: ${socket.id} from ${userId}`)

        socket.on(SocketEvents.JOIN_TASKBOARD, (taskboardId: string) => {
            socket.join(`${SocketEvents.TASKBOARD}:${taskboardId}`)
            socket.emit(SocketEvents.JOINED_TASKBOARD, { taskboardId: taskboardId })
            logger.info(`Joining taskboard: ${taskboardId}`)
        })

        socket.on(SocketEvents.LEAVE_TASKBOARD, (taskboardId: string) => {
            socket.leave(`${SocketEvents.TASKBOARD}:${taskboardId}`)
            socket.leave(`user:${userId}`)
            logger.info(`Leaving taskboard: ${taskboardId}`)
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
    const io = getIO()
    if (io)
        return io.to(`${SocketEvents.TASKBOARD}:${taskboardId}`).except(`user:${userId}`)
    return null
}