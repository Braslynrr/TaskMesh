import { HydratedDocument, Types } from "mongoose"
import { User } from "../Users/user.types"
import { listResponse } from "../List/list.types"
import { CardResponse } from "../Card/card.types"

export type Taskboard = {
    _id:string
    name:string,
    owner: User
    members: User[]
}

export type TaskBoardSnapshot = {
  _id:string
  name:string,
  owner: User
  members: User[]
  lists: listResponse[]
  cards: CardResponse[]
}

export type TaskboardDoc = HydratedDocument<{
  name: string
  ownerId: Types.ObjectId
  members: Types.ObjectId[]
}>
