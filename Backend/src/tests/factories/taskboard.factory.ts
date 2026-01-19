import { taskboardRepository } from "../../modules/Taskboard/taskboard.repository"
import { createAuthUser } from "../factories/user.factory"


export async function createTaskboard(name:string="test", username:string="test") {
  
    const {user, token} = await createAuthUser(username)

    const taskboard = await taskboardRepository.create({name: name, ownerId: user._id })

    return {token, taskboard:{ _id:taskboard._id ,name: taskboard.name, ownerId: taskboard.ownerId, members: taskboard.members }}
}


export async function createTaskboardWithMembers(members:string[], name:string="test", username:string="test"){

    const {user, token} = await createAuthUser(username)

    const {_id} = await taskboardRepository.create({name: name, ownerId: user._id })

    const taskboardWithMembers = await taskboardRepository.addMembers({ _id: _id.toString(), members: members})

    return {token, user , taskboard:{ _id:taskboardWithMembers._id.toString() ,name: taskboardWithMembers.name, ownerId: taskboardWithMembers.ownerId, members: taskboardWithMembers.members.map(m=>m.toString()) }}
}