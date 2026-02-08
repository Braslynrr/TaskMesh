import { serializeUser } from "../Users/user.serializer";
import { Taskboard, TaskboardDoc } from "./taskboard.types";

export function serializeTaskboard(taskboard:TaskboardDoc): Taskboard {
    return {
        _id: taskboard._id.toString(),
        name: taskboard.name,
        members: taskboard.members.map(member => serializeUser(member)),
        owner: serializeUser(taskboard.ownerId)
    }
}