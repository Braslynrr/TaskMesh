import { listResponse } from "./list.types";

export function serializeList(list: any): listResponse {

    return {
        _id: list._id.toString(),
        taskboardId: list.taskboardId.toString(),
        title: list.title,
        position:list.position
    }
}