import { Request, Response } from "express"
import { addMemberSchemma, createTaskboardSchemma, deleteTaskboardSchema } from "./taskboard.schema"
import { taskboardService } from "./taskboard.service"
import { injectOwnerId } from "../../utils/utils"


export async function createTaskboard(req: Request, res: Response) {

    const userId = req.user._id
    const taskobj = injectOwnerId(req.body, userId)

    const result = createTaskboardSchemma.parse(taskobj)
    const taskboard = await taskboardService.createTaskboard(result)
    res.status(201).json(taskboard)
}

export async function addMembers(req: Request, res: Response) {
    
    const userId = req.user._id
    const taskobj = injectOwnerId(req.body, userId)

    const result = addMemberSchemma.parse(taskobj)
    const taskboard = await taskboardService.addMembers(result)
    res.status(200).json(taskboard)
}

export async function deleteTaskboard(req: Request, res: Response) {
    const userId = req.user._id
    const taskobj = injectOwnerId(req.body, userId)

    const result = deleteTaskboardSchema.parse(taskobj)
    const taskboard = await taskboardService.delete(result)
    res.status(200).json(taskboard)
}