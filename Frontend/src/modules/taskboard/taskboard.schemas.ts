import z from "zod";


export const createTaskboardSchema = z.object({
    name:z.string().min(4, "name must be at least 4 characters")
})