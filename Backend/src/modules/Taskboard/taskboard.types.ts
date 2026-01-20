import { User } from "../Users/user.types"

export type Taskboard = {
    _id:string
    name:string,
    ownerId: string
    members: string[]
}