import { UserResponse } from "../auth/auth.types"
import { MongoIdRequest } from "../general/general.types"

export type TaskboardResponse = {
    _id:string
    name:string
    owner: UserResponse
    members: UserResponse[]
}


export type createTaskboardRequest = {
    name:string
}


export type CreateTaskboardProps = {
  onCreated: (taskboard: TaskboardResponse) => void
}

export type deleteTaskboardRequest = MongoIdRequest


export type TaskboardProps = {
  tb: TaskboardResponse
  onDelete: (taskboard: TaskboardResponse) => void
}


export type AddMemeberToTaskboardRequest = {
    _id:string
    members:string[]
}