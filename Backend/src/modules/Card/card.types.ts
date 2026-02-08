import { HydratedDocument, Types } from "mongoose"
import { User } from "../Users/user.types"

export interface CardResponse {
  _id: string
  title: string
  description: string
  listId: string
  createdBy: User
  assignedTo: User[]
  createdAt: Date
  updatedAt: Date
  comments:number
}


export type CardDoc  = HydratedDocument<{
  title: string
  description: string
  listId: Types.ObjectId
  createdBy: Types.ObjectId
  assignedTo: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  comments:number
}>


export type CardObject = {
    title: string;
    description: string;
    listId: Types.ObjectId;
    createdBy: Types.ObjectId;
    assignedTo: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comments: number;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}