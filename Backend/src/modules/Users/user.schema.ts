import { z } from "zod"

export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const createUserSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8)
})

export type CreateUserDTO = z.infer<typeof createUserSchema>

export type LoginUserDTO = z.infer<typeof loginUserSchema>