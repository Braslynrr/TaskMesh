import { ConflictError, NotFoundError } from "../../core/errors/errors";
import { assertUserIsMember, assertUserIsOwner } from "./taskboard.policy";
import {  taskboardRepository } from "./taskboard.repository";
import { createTaskboardDTO, addMemberDTO} from "./taskboard.schema";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { serializeTaskboard } from "./taskboard.serializer";
import { userRepository } from "../Users/user.repository";
import { TaskboardDoc } from "./taskboard.types";

export const taskboardService = {
    async createTaskboard(data:createTaskboardDTO, userId:string) {
        const taskboard = await taskboardRepository.create({ownerId:userId, ...data})
        const populatedTaskboard = await taskboardService.populateDocument(taskboard)
        return serializeTaskboard(populatedTaskboard)
    },
    async addMembers(data:addMemberDTO, userId:string){

        const taskboard = await taskboardRepository.findbyId(data._id)

        if(!taskboard)
        {
            throw new NotFoundError("taskboard was not found")
        }


        assertUserIsOwner({taskboard, userId})

        const usernameToUser = await Promise.all(data.members.map(username => userRepository.findByUsername(username)))

        const userToID = usernameToUser.map(user => user._id.toString())

        const currentMembers = taskboard.members.map(member => member._id.toString())

        data.members = userToID.filter(id => id != taskboard.ownerId.toString() && !currentMembers.includes(id))

        if(data.members.length < 1){
            throw new ConflictError("the users are already a members")
        }

        const newTaskboard = await taskboardRepository.addMembers(data)
        
        const populatedTaskboard = await taskboardService.populateDocument(newTaskboard)
        
        return serializeTaskboard(populatedTaskboard)
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
        const taskboards = await taskboardRepository.getTaskboards(id)
        const populatedtaskboards = await Promise.all(taskboards.map(taskboard => taskboardService.populateDocument(taskboard)))
        return populatedtaskboards.map(taskboard => serializeTaskboard(taskboard))
    },

    async getTaskboard(id:string, userId:string){
        const taskboard = await taskboardRepository.findbyId(id)

        assertUserIsMember({taskboard, userId})
        
        const populatedTaskboard = await taskboardService.populateDocument(taskboard)
        return serializeTaskboard(populatedTaskboard)
    },

    async populateDocument(doc: TaskboardDoc){
        return await doc.populate([{ path: "members", select: "_id username role" }, { path: "ownerId", select: "_id username role" }])}
}   