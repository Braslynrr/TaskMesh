import { z } from "zod"
import { objectIdSchema } from "../../utils/zodObjectId"

export const createTaskboardSchemma = z.object({
    name: z.string().min(4),
})


export const addMemberSchemma = z.object({
    _id: objectIdSchema,
    members: z.array(objectIdSchema).min(1)
})


export type createTaskboardDTO = z.infer<typeof createTaskboardSchemma>

export type addMemberDTO = z.infer<typeof addMemberSchemma>
