import { z } from "zod"
import { objectIdSchema } from "../../utils/zodObjectId";


export const createCardSchema = z.object({
    listId: objectIdSchema,
    title: z.string().min(4, "title must be 4 characters or more"),
    description: z.string().min(10, "description must be 10 characters at least")
})


export const updateCardSchema = z.object({
    _id: objectIdSchema,
    title: z.string().min(4, "title must be 4 characters or more"),
    description: z.string().min(10, "description must be 10 characters at least")
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
