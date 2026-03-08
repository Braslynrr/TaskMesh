import { serializeList } from "../../modules/List/list.serializer";
import { ListRepository } from "../../modules/List/list.repository";
import { taskboardRepository } from "../../modules/Taskboard/taskboard.repository";


export async function createListForTaskboard(taskboardId: string, title: string = "test") {
    const updatedBoard = await taskboardRepository.AddToListCounter(taskboardId)
    const position = updatedBoard.listCounter
    const list = await ListRepository.create({ title: title, taskboardId: taskboardId, position: position})
    return serializeList(list)
}