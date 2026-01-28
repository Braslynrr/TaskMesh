import { NotFoundError, UnauthorizedError } from "../../core/errors/errors";
import { assertUserIsOwner } from "./taskboard.policy";
import { taskboardRepository } from "./taskboard.repository";
import { createTaskboardDTO, addMemberDTO} from "./taskboard.schema";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { serializeTaskboard } from "./taskboard.serializer";

export const taskboardService = {
    async createTaskboard(data:createTaskboardDTO, userId:string) {
        const taskboard = await taskboardRepository.create({ownerId:userId, ...data})
        return serializeTaskboard(taskboard)
    },
    async addMembers(data:addMemberDTO, userId:string){

        const taskboard = await taskboardRepository.findbyId(data._id)

        if(!taskboard)
        {
            throw new NotFoundError("taskboard was not found")
        }

        assertUserIsOwner({taskboard, userId})

        const result = await taskboardRepository.addMembers(data)
        
        return serializeTaskboard(result)
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
        return (await taskboards).map(taskboard => serializeTaskboard(taskboard))
    }
}