
import { Response, Request } from "express";
import { createCommentSchema, updateCommentSchema } from "./comment.schema";
import { commentService } from "./comment.service";
import { mongoIdSchema } from "../../utils/zodObjectId";

export async function createComment(req: Request, res: Response) {
    const userId = req.user._id
    const data = createCommentSchema.parse(req.body)

    const comment = await commentService.createComment(data, userId)
    res.status(201).json(comment)
}

export async function deleteComment(req: Request, res: Response) {
    const userId = req.user._id
    const data = mongoIdSchema.parse(req.body)

    const result = await commentService.deleteComment(data, userId)
    res.status(200).json(result)
}

export async function updateComment(req: Request, res: Response) {
    const userId = req.user._id
    const data = updateCommentSchema.parse(req.body)

    const comment = await commentService.updateComment(data, userId)
    res.status(200).json(comment)

}

export async function getComments(req: Request, res: Response) {
    const userId = req.user._id
    const data = mongoIdSchema.parse(req.body)

    const result = await commentService.getComments(data, userId)
    res.status(200).json(result)
}