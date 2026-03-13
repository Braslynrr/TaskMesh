

export type MongoIdRequest = {
    _id: string
}

export type DeleteResponse = {
    deletedCount: number
}

export type Activity = {
    author:string
    action: string
}