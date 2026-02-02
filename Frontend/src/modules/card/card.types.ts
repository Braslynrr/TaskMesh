import { MongoIdRequest } from "../general/general.types"

export type getCardsRequest = MongoIdRequest

export type createCardRequest = {
    title: string,
    description: string,
    listId: String
}


export type cardResponse = {
    _id: string,
    title: string,
    description: string,
    listId: String,
    createdBy: string,
    assignedTo: string[],
    createdAt: Date,
    updatedAt: Date,

}


export type createCardProps = {
    onCancel: () => void, 
    onCreate: (card:cardResponse) => void,
    listId: string
}

export type cardProps = {
    card: cardResponse
}
