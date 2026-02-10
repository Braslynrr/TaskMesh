import { ConflictError, NotFoundError } from "../../core/errors/errors";
import { assertUserIsMember, assertUserIsOwner } from "./taskboard.policy";
import {  taskboardRepository } from "./taskboard.repository";
import { createTaskboardDTO, addMemberDTO} from "./taskboard.schema";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { serializeTaskboard, serializeTaskboardSnapshot } from "./taskboard.serializer";
import { userRepository } from "../Users/user.repository";
import { TaskboardDoc } from "./taskboard.types";
import { listService } from "../List/list.service";
import { cardService } from "../Card/card.service";

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

        const nullsRemoved = usernameToUser.filter(item => item !== null)

        if(nullsRemoved.length < 1){
            throw new NotFoundError("given username is not registered")
        }

        const userToID = nullsRemoved.map(user => user._id.toString())

        const currentMembers = taskboard.members.map(member => member._id.toString())

        data.members = userToID.filter(id => id != taskboard.ownerId.toString() && !currentMembers.includes(id))

        if(data.members.length < 1){
            throw new ConflictError("the user is already a member")
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

    async getTaskboardSnapshot(id:string, userId:string){
        const taskboard = await taskboardRepository.findbyId(id)
        
        assertUserIsMember({taskboard, userId})

        const populatedTaskboard = await taskboardService.populateDocument(taskboard)

        const lists = await listService.getList(id, userId)

        const listIds = lists.map(l => ({ _id :l._id }) )

        const cards = await Promise.all( listIds.map( id => cardService.getCards( id , userId)))

        return serializeTaskboardSnapshot(serializeTaskboard(populatedTaskboard), lists, cards.flat())
    },
    
    async populateDocument(doc: TaskboardDoc) {
        return await doc.populate([{ path: "members", select: "_id username" }, { path: "ownerId", select: "_id username" }])
    }, 
    
}   