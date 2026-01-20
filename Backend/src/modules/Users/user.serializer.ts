import { User } from "./user.types";


export function serializeUser(user: any): User {
    return {
        _id: user._id.toString(),
        username: user.username,
        role: user.role
    }
}