import { z } from "zod"

export const envSchema = z.object({
    NODE_ENV: z.string().default("development"),

    JWT_SECRET: z.string().min(10, "JWT_SECRET is required, and must hace 10 characters or more"),
    JWT_REFRESH: z.string().min(10, "JWT_REFRESH is required, and must hace 10 characters or more"),
    AUTH_TIME: z.string().default("15m"),
    REFRESH_TIME: z.string().default("1d"),

    MONGO_URI: z.url("MONGO_URI must be a valid URL"),

    CORS_ALLOW_LIST: z.string().default("*"),
    PORT: z.coerce.number().default(3000),
})


export type envType = z.infer<typeof envSchema>