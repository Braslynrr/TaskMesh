import { NotFoundError, UnauthorizedError } from "../../core/errors/errors";
import { assertUserIsOwner } from "./taskboard.policy";
import { taskboardRepository } from "./taskboard.repository";
import { createTaskboardDTO, addMemberDTO} from "./taskboard.schema";
import { mongoIdDTO } from "../../utils/zodObjectId";

export const taskboardService = {
    async createTaskboard(data:createTaskboardDTO) {
        const taskboard = await taskboardRepository.create(data)
        return {id:taskboard._id, members:taskboard.members, name: taskboard.name, ownerId:taskboard.ownerId}
    },
    async addMembers(data:addMemberDTO, userId:string){

        const taskboard = await taskboardRepository.findbyId(data._id)

        if(!taskboard)
        {
            throw new NotFoundError("taskboard was not found")
        }

        assertUserIsOwner({taskboard, userId})

        const result = await taskboardRepository.addMembers(data)
         return {id:result._id, members:result.members, name: result.name, ownerId:result.ownerId}
    },
    async delete(data:mongoIdDTO, userId:string){

        const taskboard = await taskboardRepository.findbyId(data._id)

        if(!taskboard)
        {
            throw new NotFoundError("taskboard was not found")
        }

        assertUserIsOwner({taskboard, userId})

        const result = await taskboardRepository.delete({ownerId:userId, ...data})
        return result
    },

    async getTaskboards(id:string){
        const taskboards = taskboardRepository.getTaskboards(id)
        return (await taskboards).map(taskboard => { return {_id:taskboard._id, name:taskboard.name, ownerId:taskboard.ownerId ,members: taskboard.members.map(member => member.toString())}})
    }
}