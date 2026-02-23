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
    onUpdate: (card:cardResponse) => void
}


export type cardViewProps = {
    card: cardResponse
    canModify:boolean
    taskboardMembers: UserResponse[]
    taskBoardOwner: UserResponse
    user:UserResponse  
    isTaskboardOwner:boolean
    setEditCard: () => void
    onAssign: (card:cardResponse) => void
    onDelete: (card:cardResponse) => void
}

export type ghostCardProps = {
    card: cardResponse
}

export type  cardEditProps = {
    card: cardResponse
    cancel: () => void
    onUpdate: (card:cardResponse) => void
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

export type updateCardRequest = {
    _id: string
    title: string
    description:string
}