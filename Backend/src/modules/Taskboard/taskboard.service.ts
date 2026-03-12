import { ConflictError, NotFoundError } from "../../core/errors/errors";
import { assertUserIsMember, assertUserIsOwner } from "./taskboard.policy";
import { taskboardRepository } from "./taskboard.repository";
import { createTaskboardDTO, addMemberDTO, removeMemberDTO } from "./taskboard.schema";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { serializeTaskboard, serializeTaskboardSnapshot } from "./taskboard.serializer";
import { userRepository } from "../Users/user.repository";
import { Taskboard, TaskboardDoc } from "./taskboard.types";
import { listService } from "../List/list.service";
import { cardService } from "../Card/card.service";
import { boardEmitter, getIO } from "../Socket/socket.server";
import { SocketEvents } from "../Socket/socket.events";

export const taskboardService = {
    async createTaskboard(data: createTaskboardDTO, userId: string) {
        const taskboard = await taskboardRepository.create({ ownerId: userId, ...data })
        const populatedTaskboard = await taskboardService.populateDocument(taskboard)
        return serializeTaskboard(populatedTaskboard)
    },
    async addMembers(data: addMemberDTO, userId: string) {

        const taskboard = await taskboardRepository.findbyId(data._id)

        if (!taskboard) {
            throw new NotFoundError("taskboard was not found")
        }


        assertUserIsOwner({ taskboard, userId })

        const usernameToUser = await Promise.all(data.members.map(username => userRepository.findByUsername(username)))

        const nullsRemoved = usernameToUser.filter(item => item !== null)

        if (nullsRemoved.length < 1) {
            throw new NotFoundError("given username is not registered")
        }

        const userToID = nullsRemoved.map(user => user._id.toString())

        const currentMembers = taskboard.members.map(member => member._id.toString())

        data.members = userToID.filter(id => id != taskboard.ownerId.toString() && !currentMembers.includes(id))

        if (data.members.length < 1) {
            throw new ConflictError("the user is already a member")
        }

        const newTaskboard = await taskboardRepository.addMembers(data)

        const populatedTaskboard = await taskboardService.populateDocument(newTaskboard)

        const serializedTaskboard = await serializeTaskboard(populatedTaskboard)

        const serializedAndConnectedTaskboards = await taskboardService.getConnectedUsers([serializedTaskboard])

        const finalTaskboard = serializedAndConnectedTaskboards[0]

        const emitter = boardEmitter(data._id, userId)
        emitter.emit(SocketEvents.TASKBOARD_MEMBERS, { taskboard: finalTaskboard, authorId: userId })

        return finalTaskboard
    },

    async removeMember(data: removeMemberDTO, userId: string) {
        const taskboard = await taskboardRepository.findbyId(data._id)

        if (!taskboard) {
            throw new NotFoundError("taskboard was not found")
        }

        assertUserIsOwner({ taskboard, userId })

        const newTaskboard = await taskboardRepository.removeMember(data)

        const populatedTaskboard = await taskboardService.populateDocument(newTaskboard)

        const serializedTaskboard = await serializeTaskboard(populatedTaskboard)

        const serializedAndConnectedTaskboards = await taskboardService.getConnectedUsers([serializedTaskboard])

        const finalTaskboard = serializedAndConnectedTaskboards[0]

        const emitter = boardEmitter(data._id, userId)
        emitter.emit(SocketEvents.TASKBOARD_MEMBERS, { taskboard: finalTaskboard, authorId: userId })

        return finalTaskboard
    },

    async delete(data: mongoIdDTO, userId: string) {

        const taskboard = await taskboardRepository.findbyId(data._id)

        if (!taskboard) {
            throw new NotFoundError("taskboard was not found")
        }

        assertUserIsOwner({ taskboard, userId })

        const result = await taskboardRepository.delete({ ownerId: userId, ...data })
        return result
    },

    async getTaskboards(id: string) {
        const taskboards = await taskboardRepository.getTaskboards(id)
        const populatedtaskboards = await Promise.all(taskboards.map(taskboard => taskboardService.populateDocument(taskboard)))
        const serializedTaskboard = populatedtaskboards.map(taskboard => serializeTaskboard(taskboard))
        const serializedAndConnectedTaskboards = await taskboardService.getConnectedUsers(serializedTaskboard)

        return serializedAndConnectedTaskboards
    },

    async getTaskboard(id: string, userId: string) {
        const taskboard = await taskboardRepository.findbyId(id)

        if (!taskboard) {
            throw new NotFoundError("taskboard was not found")
        }

        assertUserIsMember({ taskboard, userId })

        const populatedTaskboard = await taskboardService.populateDocument(taskboard)
        const serializedTaskboard = serializeTaskboard(populatedTaskboard)
        const serializedAndConnectedTaskboards = await taskboardService.getConnectedUsers([serializedTaskboard])

        return serializedAndConnectedTaskboards[0]
    },

    async getTaskboardSnapshot(id: string, userId: string) {
        const taskboard = await taskboardRepository.findbyId(id)

        assertUserIsMember({ taskboard, userId })

        const populatedTaskboard = await taskboardService.populateDocument(taskboard)

        const lists = await listService.getList(id, userId)

        const listIds = lists.map(l => ({ _id: l._id }))

        const cards = await Promise.all(listIds.map(id => cardService.getCards(id, userId)))

        return serializeTaskboardSnapshot(serializeTaskboard(populatedTaskboard), lists, cards.flat())
    },

    async populateDocument(doc: TaskboardDoc) {
        return await doc.populate([{ path: "members", select: "_id username" }, { path: "ownerId", select: "_id username" }])
    },

    async getConnectedUsers(taskboards: Taskboard[]) {

        let newTaskboards = [...taskboards]
        const io = getIO()
        if (io) {

            for (let taskboard of newTaskboards) {
                const room = `${SocketEvents.TASKBOARD}:${taskboard._id}`
                const sockets = await io.in(room).fetchSockets()

                if (sockets.some(s => s.data.user._id === taskboard.owner._id)) {
                    taskboard.owner = { ...taskboard.owner, connected: true }
                }

                taskboard.members = taskboard.members.map(member => sockets.some(s => s.data.user._id === member._id) ? { ...member, connected: true } : member)

            }

        }
        return newTaskboards
    },

}   