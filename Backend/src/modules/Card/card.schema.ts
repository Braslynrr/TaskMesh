import { z } from "zod"
import { objectIdSchema } from "../../utils/zodObjectId";

export const createCardSchema = z.object({
    listId: objectIdSchema,
    title: z.string().min(4),
    description: z.string()
})


export const updateCardSchema = z.object({
    _id: objectIdSchema,
    title: z.string().min(4),
    description: z.string()
})


export const assignUsersToCardSchema = z.object({
    _id: objectIdSchema,
    assignedTo: z.array(objectIdSchema)
})

export const moveFromListSchema = z.object({
    _id: objectIdSchema,
    listId: objectIdSchema
})


export type moveFromListDTO = z.infer<typeof moveFromListSchema>

export type assignUsersToCardDTO = z.infer<typeof assignUsersToCardSchema>

export type updateCardDTO = z.infer<typeof updateCardSchema>

export type createCardDTO = z.infer<typeof createCardSchema>
