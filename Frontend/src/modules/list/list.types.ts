import { Dispatch, SetStateAction } from "react"
import { UserResponse } from "../auth/auth.types"
import { cardResponse } from "../card/card.types"

export type CreateListProps = {
  taskboardId: string
  onCreate: (list:listResponse) => void
  onCancel: () => void
}

export type listResponse = {
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
    list: listResponse
    taskBoardOwner: UserResponse
    user:UserResponse
    list_cards:cardResponse[]
    onDelete: (list:listResponse) => void
    setCards:Dispatch<SetStateAction<cardResponse[]>>
}

export type updateListRequest = {
    _id:string,
    title:string
}