import z from "zod";


export const createTaskboardSchema = z.object({
    name:z.string().min(4)
})

export const createListSchema = z.object({
    title:z.string().min(4),
    taskboardId: z.string()
})