import { HydratedDocument, Types } from "mongoose"
import { User } from "../Users/user.types"

export type Taskboard = {
    _id:string
    name:string,
    owner: User
    members: string|User[]
}

export type TaskboardDoc = HydratedDocument<{
  name: string
  ownerId: Types.ObjectId
  members: Types.ObjectId[]
}>