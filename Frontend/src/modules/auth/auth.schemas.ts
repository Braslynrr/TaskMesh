import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

export const registerSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
}).and(passwordSchema)

export const passwordResetSchema = registerSchema

export type LoginFormValues = z.infer<typeof loginSchema>
