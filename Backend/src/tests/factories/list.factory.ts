import { ListRepository } from "../../modules/List/list.repository";
import { taskboardRepository } from "../../modules/Taskboard/taskboard.repository";


export async function createListForTaskboard(taskboardId: string, title: string = "test") {
    const updatedBoard = await taskboardRepository.AddToListCounter(taskboardId)
    const position = updatedBoard.listCounter
    const list = await ListRepository.create({ title: title, taskboardId: taskboardId, position: position})
    return { _id: list._id, title: list.title, taskboardId: list.taskboardId, position: list.position }
}