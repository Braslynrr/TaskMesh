import { UserResponse } from "../auth/auth.types"
import { MongoIdRequest } from "../general/general.types"

export type getCardsRequest = MongoIdRequest

export type createCardRequest = {
    title: string,
    description: string,
    listId: String
}

export type assignToCardRequest = {
    _id:string
    assignedTo:string[]
}

export type cardResponse = {
    _id: string,
    title: string,
    description: string,
    listId: String,
    createdBy: UserResponse,
    assignedTo: UserResponse[],
    createdAt: Date,
    updatedAt: Date,
    comments: number
}


export type createCardProps = {
    onCancel: () => void, 
    onCreate: (card:cardResponse) => void,
    listId: string
}

export type cardProps = {
    card: cardResponse
    taskboardMembers: UserResponse[]
    taskBoardOwner: UserResponse
    user:UserResponse    
    onAssign: (card:cardResponse) => void
    onDelete: (card:cardResponse) => void
    ghost?: boolean
}


export type assignCardProps = {
    onCancel: () => void,
    taskboardUsers: UserResponse[]
    currentAssignedUsers: UserResponse[]
    onAssign: (card:cardResponse) => void
    cardId:string
}

export type moveCardRequest = {
    _id: string
    listId: string
}