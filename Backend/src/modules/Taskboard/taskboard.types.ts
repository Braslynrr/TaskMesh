import { User } from "../Users/user.types"

export type Taskboard = {
    _id:string
    name:string,
    owner: User
    members: string|User[]
}