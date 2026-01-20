import z from "zod";
import { objectIdSchema } from "../../utils/zodObjectId";


export const createCommentSchema = z.object({
    cardId: objectIdSchema,
    text: z.string()
})

export const updateCommentSchema = z.object({
    _id: objectIdSchema,
    text: z.string()
})


export type createCommentDTO = z.infer<typeof createCommentSchema>

export type updateCommentDTO = z.infer<typeof updateCommentSchema>