import { Response, Request } from "express";
import { createListSchema, movePositionListSchema, searchListSchema } from "./list.schema";
import { listService } from "./list.service";
import { mongoIdSchema } from "../../utils/zodObjectId";


export async function createList(req: Request, res: Response) {
    const userId = req.user._id
    const body = {position:0, ...req.body }
    const data = createListSchema.parse(body)
    const newList = await listService.createList(data, userId)
    res.status(201).json(newList)
}

export async function deleteList(req: Request, res: Response) {
    const userId = req.user._id
    const data = searchListSchema.parse(req.body)
    const result = await listService.delete(data, userId)
    res.status(200).json(result)
}

export async function getLists(req: Request, res: Response) {
    const userId = req.user._id
    const body = { _id: req.body.taskboardId}

    const data = mongoIdSchema.parse(body)
    const lists = await listService.getList(data._id, userId)

    res.status(200).json(lists)
}

export async function moveList(req: Request, res: Response) {
    const userId = req.user._id
    const data = movePositionListSchema.parse(req.body)
    const lists = await listService.movePosition(data, userId)
     res.status(200).json(lists)
}
