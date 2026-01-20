import { Taskboard } from "./taskboard.types";


export function serializeTaskboard(taskboard: any): Taskboard {
    return {
        _id: taskboard._id.toString(),
        name: taskboard.name,
        members: taskboard.members.map(member => member.toString()),
        ownerId: taskboard.ownerId.toString()
    }
}