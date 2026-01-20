import { ListRepository } from "../../modules/List/list.repository";


export async function createListForTaskboard(taskboardId:string, title:string = "test", position:number = 0){
    const list = await ListRepository.create({ title:title, taskboardId:taskboardId, position:position})
    return { _id: list._id, title:list.title, taskboardId:list.taskboardId, position:list.position }
}