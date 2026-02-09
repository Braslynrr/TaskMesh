import { ConflictError, NotFoundError } from "../../core/errors/errors";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { assertUserIsMember } from "../Taskboard/taskboard.policy";
import { taskboardRepository } from "../Taskboard/taskboard.repository";
import { ListRepository } from "./list.repository";
import { createListDTO, movePositionListDTO, searchListDTO } from "./list.schema";
import { serializeList } from "./list.serializer";


export const listService = {

    async createList(data: createListDTO, userId: string){

        const nextNumberList = await ListRepository.countList(data.taskboardId)
        data.position = nextNumberList + 1

        const taskboard = await taskboardRepository.findbyId(data.taskboardId)

        if(!taskboard){
            throw new NotFoundError("assigned taskboard does not exist")
        }
        
        assertUserIsMember({taskboard, userId})

        const list = await ListRepository.create(data)
        return serializeList(list)
    },

    async getList(taskboardId:string, userId: string){
        const taskboard = await taskboardRepository.findbyId(taskboardId)

        if(!taskboard){
            return []
        }

        assertUserIsMember({taskboard, userId})

        const lists = await ListRepository.getLists(taskboardId)
        return lists.map(list => serializeList(list))
    },

    async delete(data:mongoIdDTO, userId: string){

        const list = await ListRepository.getListById(data._id)

        if(!list){
            throw new NotFoundError("list does not exist")
        }

        const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

        if(!taskboard){
            throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({taskboard, userId})

        const result = await ListRepository.delete(data._id)
        return result
    }, 

    async movePosition(data: movePositionListDTO, userId: string){

        const taskboard = await taskboardRepository.findbyId(data.taskboardId)

        if(!taskboard){
            throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({taskboard, userId})

        const list = await ListRepository.getListByIds({_id:data._id, taskboardId:data.taskboardId});

        if (!list) throw new NotFoundError("the moved list does not exist");

        const originalLists = await ListRepository.getLists(list.taskboardId.toString());

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
        
        if(!lists.isOk()){
            throw new ConflictError(lists.getWriteErrors().toString())
        }

        return ListRepository.getLists(data.taskboardId)

    },

    async getListByIds(data: searchListDTO){
        const list = await ListRepository.getListByIds(data)
        return serializeList(list) 
    }

}