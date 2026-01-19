import { Request, Response } from "express"
import { addMemberSchemma, createTaskboardSchemma } from "./taskboard.schema"
import { taskboardService } from "./taskboard.service"
import { injectOwnerId } from "../../utils/utils"
import { mongoIdSchema } from "../../utils/zodObjectId"


export async function createTaskboard(req: Request, res: Response) {

    const userId = req.user._id
    const taskobj = injectOwnerId(req.body, userId)

    const result = createTaskboardSchemma.parse(taskobj)
    const taskboard = await taskboardService.createTaskboard(result)
    res.status(201).json(taskboard)
}

export async function addMembers(req: Request, res: Response) {
    
    const userId = req.user._id

    const result = addMemberSchemma.parse(req.body)
    const taskboard = await taskboardService.addMembers(result, userId)
    res.status(200).json(taskboard)
}

export async function deleteTaskboard(req: Request, res: Response) {
    const userId = req.user._id

    const result = mongoIdSchema.parse(req.body)
    const taskboard = await taskboardService.delete(result, userId)
    res.status(200).json(taskboard)
}

export async function getTaskboards(req: Request, res: Response) {
    const userId = req.user._id
    const taskboards = await taskboardService.getTaskboards(userId)
    res.status(200).json(taskboards)
}