import { taskboardRepository } from "../../modules/Taskboard/taskboard.repository"
import { serializeTaskboard } from "../../modules/Taskboard/taskboard.serializer"
import { createAuthUser } from "../factories/user.factory"


export async function createTaskboard(name:string="test", username:string="test") {
  
    const {user, token} = await createAuthUser(username)

    const taskboard = await taskboardRepository.create({name: name, ownerId: user._id })

    return {token, user ,taskboard:{ _id:taskboard._id ,name: taskboard.name, ownerId: taskboard.ownerId, members: taskboard.members }}
}


export async function createTaskboardWithMembers(members:string[], name:string="test", username:string="test"){

    const {user, token} = await createAuthUser(username)

    const {_id} = await taskboardRepository.create({name: name, ownerId: user._id })

    const taskboardWithMembers = await AddMemberToTaskboard(_id.toString(), members)

    return {token, user , taskboard: taskboardWithMembers}
}


export async function AddMemberToTaskboard(taskboardId:string, members:string[]){

    const result = await taskboardRepository.addMembers({_id:taskboardId, members:members})

    return serializeTaskboard(result)

}