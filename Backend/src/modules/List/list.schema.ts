import { z } from "zod"
import { objectIdSchema } from "../../utils/zodObjectId";


export const createListSchema = z.object({
    taskboardId: objectIdSchema,
    title: z.string().min(4, "title must be at least 4 characters"),
    position: z.int()
})

export const movePositionListSchema = z.object({
    taskboardId: objectIdSchema,
    _id: objectIdSchema,
    position: z.int().min(1, "position should be greater than one")
})

export const searchListSchema = z.object({
    taskboardId: objectIdSchema,
    _id: objectIdSchema,
})

export const updateListShema = z.object(
    {
        _id: objectIdSchema,
        title: z.string().min(4, "title must be at least 4 characters"),
    }
)

export type searchListDTO = z.infer<typeof searchListSchema>

export type createListDTO = z.infer<typeof createListSchema>

export type movePositionListDTO = z.infer<typeof movePositionListSchema>

export type updateListDTO = z.infer<typeof updateListShema>
