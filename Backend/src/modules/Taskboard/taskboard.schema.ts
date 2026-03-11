import { z } from "zod"
import { objectIdSchema } from "../../utils/zodObjectId"

export const createTaskboardSchemma = z.object({
    name: z.string().min(4, "name must be at least 4 characters"),
})

export const addMemberSchemma = z.object({
    _id: objectIdSchema,
    members: z.array(z.string().min(4, "username must be at least 4 characters")).min(1, "members must have at least one member")
})

export const removeMemberSchema = z.object({
    _id: objectIdSchema,
    userId: objectIdSchema
})

export type createTaskboardDTO = z.infer<typeof createTaskboardSchemma>

export type addMemberDTO = z.infer<typeof addMemberSchemma>

export type removeMemberDTO = z.infer<typeof removeMemberSchema>
