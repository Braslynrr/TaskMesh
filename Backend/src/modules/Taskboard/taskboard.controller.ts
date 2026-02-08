import { Request, Response } from "express"
import { addMemberSchemma, createTaskboardSchemma } from "./taskboard.schema"
import { taskboardService } from "./taskboard.service"
import { mongoIdSchema } from "../../utils/zodObjectId"


export async function createTaskboard(req: Request, res: Response) {
    const userId = req.user._id

    const result = createTaskboardSchemma.parse(req.body)
    const taskboard = await taskboardService.createTaskboard(result, userId)
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
    const { id } = req.params
    const body = { _id: id}

    const result = mongoIdSchema.parse(body)
    const taskboard = await taskboardService.delete(result, userId)
    res.status(200).json(taskboard)
}

export async function getTaskboards(req: Request, res: Response) {
    const userId = req.user._id
    const taskboards = await taskboardService.getTaskboards(userId)
    res.status(200).json(taskboards)
}

export async function getTaskboard(req: Request, res: Response) {
    const userId = req.user._id
    const { id } = req.params
    const body = { _id: id}

    const result = mongoIdSchema.parse(body)
    const taskboard = await taskboardService.getTaskboard(result._id, userId)
    res.status(200).json(taskboard)
}

export async function getTaskboardSnapshot(req: Request, res: Response) {
    const userId = req.user._id
    const { id } = req.params
    const body = { _id: id}

    const result = mongoIdSchema.parse(body)
    const taskboard = await taskboardService.getTaskboardSnapshot(result._id, userId)
    res.status(200).json(taskboard)
}