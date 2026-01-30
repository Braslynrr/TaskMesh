import { serializeUser } from "../Users/user.serializer";
import { TaskboardDoc } from "./taskboard.repository";
import { Taskboard } from "./taskboard.types";

export function serializeTaskboard(taskboard:TaskboardDoc): Taskboard {
    return {
        _id: taskboard._id.toString(),
        name: taskboard.name,
        members: taskboard.members.map(member => serializeUser(member)),
        owner: serializeUser(taskboard.ownerId)
    }
}