import { z } from "zod"

export const loginUserSchema = z.object({
  username: z.string().min(4, "username must be at least 4 characters"),
  password: z.string().min(8, "password must be at least 8 characters")
})

export const createUserSchema = loginUserSchema

export type CreateUserDTO = z.infer<typeof createUserSchema>

export type LoginUserDTO = z.infer<typeof loginUserSchema>