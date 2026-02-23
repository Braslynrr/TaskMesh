import { Dispatch, SetStateAction } from "react"
import { UserResponse } from "../auth/auth.types"
import { cardResponse } from "../card/card.types"

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
    isDragging?:boolean
    list: ListResponse
    taskBoardOwner: UserResponse
    taskboardMembers: UserResponse[]
    user:UserResponse
    list_cards:cardResponse[]
    onDelete: (list:ListResponse) => void
    setCards:Dispatch<SetStateAction<cardResponse[]>>
}

export type updateListRequest = {
    _id:string,
    title:string
}