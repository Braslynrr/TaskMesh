import z from "zod";

export const createCardSchema = z.object({
    title:  z.string().min(4, "title must be at least 4 characters"),
    listId: z.string(),
    description: z.string().min(10 , "card should have a description (minimun of 10 characters)")
})