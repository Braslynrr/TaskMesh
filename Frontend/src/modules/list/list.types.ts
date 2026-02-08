import { UserResponse } from "../auth/auth.types"

export type CreateListProps = {
  taskboardId: string
  onCreate: (list:ListResponse) => void
}

export type ListResponse = {
    _id:string
    title:string
    taskboardId:string  
    position:number
}

export type createListRequest = {
    title:string
    taskboardId:string  
}

export type moveListRequest = {
    _id:string
    taskboardId:string
    position:number  
}

export type listProps = {
    list: ListResponse
    taskBoardOwner: UserResponse
    taskboardMembers: UserResponse[]
    user:UserResponse
}