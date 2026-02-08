import { HydratedDocument, Types } from "mongoose"
import { User } from "../Users/user.types"


export type CommentResponse = {
    _id:string,
    cardId:string,
    author:User,
    text:string,
    createdAt: Date
    updatedAt: Date
} 


export type CommentDoc = HydratedDocument<{
    authorId: Types.ObjectId
    cardId: Types.ObjectId
    text:string,
    createdAt: Date
    updatedAt: Date
}>