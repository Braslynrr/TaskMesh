import { NotFoundError, UnauthorizedError } from "../../core/errors/errors";
import { taskboardRepository } from "./taskboard.repository";
import { createTaskboardDTO, addMemberDTO, deleteTaskboardDTO } from "./taskboard.schema";

export const taskboardService = {
    async createTaskboard(data:createTaskboardDTO) {
        const taskboard = await taskboardRepository.create(data)
        return {id:taskboard._id, members:taskboard.members, name: taskboard.name, ownerId:taskboard.ownerId}
    },
    async addMembers(data:addMemberDTO){

        const taskboard = await taskboardRepository.findbyId(data._id)

        if(!taskboard)
        {
            throw new NotFoundError("Taskboard was not found")
        }

        if(!taskboard.ownerId.equals(data.ownerId)){
            throw new UnauthorizedError("Access denied. You don’t have permission to perform this action.")
        }

        const result = await taskboardRepository.addMembers(data)
         return {id:result._id, members:result.members, name: result.name, ownerId:result.ownerId}
    },
    async delete(data:deleteTaskboardDTO){

        const taskboard = await taskboardRepository.findbyId(data._id)

        if(!taskboard)
        {
            throw new NotFoundError("Taskboard was not found")
        }

        if(!taskboard.ownerId.equals(data.ownerId)){
            throw new UnauthorizedError("Access denied. You don’t have permission to perform this action.")
        }

        const result = await taskboardRepository.delete(data)
        return result
    }
}