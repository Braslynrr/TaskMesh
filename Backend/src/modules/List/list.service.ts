import { ConflictError, NotFoundError } from "../../core/errors/errors";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { SocketEvents } from "../Socket/socket.events";
import { boardEmitter } from "../Socket/socket.server";
import { assertUserIsMember } from "../Taskboard/taskboard.policy";
import { taskboardRepository } from "../Taskboard/taskboard.repository";
import { ListRepository } from "./list.repository";
import { createListDTO, movePositionListDTO, searchListDTO, updateListDTO } from "./list.schema";
import { serializeList } from "./list.serializer";


export const listService = {

    async createList(data: createListDTO, userId: string) {

        const taskboard = await taskboardRepository.findbyId(data.taskboardId)

        if (!taskboard) {
            throw new NotFoundError("assigned taskboard does not exist")
        }

        assertUserIsMember({ taskboard, userId })

        const updatedBoard = await taskboardRepository.AddToListCounter(data.taskboardId)
        data.position = updatedBoard.listCounter
        
        const list = await ListRepository.create(data)
        const serializedList = serializeList(list)


        const emitter = boardEmitter(data.taskboardId)
        emitter.emit(SocketEvents.LIST_CREATED, { list: serializedList })

        return serializedList
    },

    async getList(taskboardId: string, userId: string) {
        const taskboard = await taskboardRepository.findbyId(taskboardId)

        if (!taskboard) {
            return []
        }

        assertUserIsMember({ taskboard, userId })

        const lists = await ListRepository.getLists(taskboardId)
        return lists.map(list => serializeList(list))
    },

    async delete(data: mongoIdDTO, userId: string) {

        const list = await ListRepository.getListById(data._id)

        if (!list) {
            throw new NotFoundError("list does not exist")
        }

        const taskboardId = list.taskboardId.toString()

        const taskboard = await taskboardRepository.findbyId(taskboardId)

        if (!taskboard) {
            throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({ taskboard, userId })

        const result = await ListRepository.delete(data._id)

        listService.orderList(taskboard._id.toString(), userId)

        const emitter = boardEmitter(taskboardId)
        emitter.emit(SocketEvents.LIST_DELETED, { listId: data._id })

        return result
    },

    async movePosition(data: movePositionListDTO, userId: string) {

        const taskboard = await taskboardRepository.findbyId(data.taskboardId)

        if (!taskboard) {
            throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({ taskboard, userId })

        const list = await ListRepository.getListByIds({ _id: data._id, taskboardId: data.taskboardId });

        if (!list) throw new NotFoundError("the moved list does not exist");

        const originalLists = await ListRepository.getLists(list.taskboardId.toString());

        const originalPosition = originalLists.findIndex(l=> l._id.toString() === list._id.toString())

        // Remove moved list
        const filtered = originalLists.filter(l => !l._id.equals(list._id));

        // Insert at new position (1-based → 0-based)
        filtered.splice(data.position - 1, 0, list);

        // Reassign positions
        const updates = filtered.map((l, index) => ({
            _id: l._id.toString(),
            position: index + 1
        }));

        const lists = await ListRepository.bulkUpdatePositions(updates);

        if (!lists.isOk()) {
            throw new ConflictError(lists.getWriteErrors().toString())
        }

        const emitter = boardEmitter(taskboard._id.toString())
        emitter.emit(SocketEvents.LIST_MOVED, { listId: list._id.toString(), from: originalPosition + 1, to: data.position })

        return ListRepository.getLists(data.taskboardId)

    },

    async orderList(taskboardId: string, userId: string) {

        const lists = await listService.getList(taskboardId, userId)

        const updates = lists.map((l, index) => ({
            _id: l._id.toString(),
            position: index + 1
        }));

        const result = await ListRepository.bulkUpdatePositions(updates);

        if (!result.isOk()) {
            throw new ConflictError(result.getWriteErrors().toString())
        }
    },

    async getListByIds(data: searchListDTO) {
        const list = await ListRepository.getListByIds(data)
        return serializeList(list)
    },

    async updateList(data: updateListDTO, userId: string) {
        const list = await ListRepository.getListById(data._id)

        if (!list) {
            throw new NotFoundError("list does not exist")
        }

        const taskboardId = list.taskboardId.toString()

        const taskboard = await taskboardRepository.findbyId(taskboardId)

        if (!taskboard) {
            throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({ taskboard: taskboard, userId })

        const updatedList = await ListRepository.updateList(data)

        const serializedList = serializeList(updatedList)

        const emitter = boardEmitter(taskboardId)
        emitter.emit(SocketEvents.LIST_UPDATED, { list: serializedList })

        return serializedList
    }

}