import { taskboardModel  } from "../../modules/Taskboard/taskboard.repository"
import { createAuthUser } from "../factories/user.factory"


export async function createTaskboard(name:string="test") {
  
    const {user, token} = await createAuthUser()

    const taskboard = await taskboardModel.create({name: name, ownerId: user._id })

    return {token, taskboard:{ _id:taskboard._id ,name: taskboard.name, ownerId: taskboard.ownerId, members: taskboard.members }}
}