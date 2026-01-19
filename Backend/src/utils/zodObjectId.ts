import { Types } from "mongoose"
import { z } from "zod"

export const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: "Invalid ObjectId" }
)

export const mongoIdSchema = z.object(
  { _id: objectIdSchema }
)

export type mongoIdDTO = z.infer<typeof mongoIdSchema>


export function membersObjectIds(members: string[])
{
    return members.map(id => new Types.ObjectId(id))
}
