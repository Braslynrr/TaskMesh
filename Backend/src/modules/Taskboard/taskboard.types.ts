import { User } from "../Users/user.types"

export type Taskboard = {
    name:string,
    lists: [],
    ownerid: string
    members: string[]
}