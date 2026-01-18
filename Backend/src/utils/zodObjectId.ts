import { Types } from "mongoose"
import { z } from "zod"

export const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: "Invalid ObjectId" }
)


export function membersObjectIds(members: string[])
{
    return members.map(id => new Types.ObjectId(id))
}
