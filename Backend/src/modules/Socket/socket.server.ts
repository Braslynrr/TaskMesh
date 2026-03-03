import { Server } from "socket.io";
import { SocketEvents } from "./socket.events";
import { ClientToServerEvents, ServerToClientEvents } from "./socket.types";

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

        handlingEvents()
    }
}

function handlingEvents() {
    io.on(SocketEvents.CONNECTION, (socket) => {

        socket.on(SocketEvents.JOIN_TASKBOARD, (taskboardId: string) => {
            socket.join(`${SocketEvents.TASKBOARD}:${taskboardId}`)
            socket.emit(SocketEvents.JOINED_TASKBOARD, { taskboardId: taskboardId })
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
) {
    const io = getIO()
    if (io)
        return io.to(`${SocketEvents.TASKBOARD}:${taskboardId}`)
    return null
}