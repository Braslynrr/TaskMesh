import z from "zod";

export const createListSchema = z.object({
    title:z.string().min(4, "title must be at least 4 characters"),
    taskboardId: z.string()
})

