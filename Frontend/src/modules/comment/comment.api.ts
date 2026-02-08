import { apiClient } from "@/lib/api-client"
import { commentResponse, createCommentRequest } from "./comment.types";

export async function createComment(data:createCommentRequest): Promise<commentResponse> {
    const res = await apiClient.post(`comment/`, data)
    return res.data
}

export async function getComments(id:string): Promise<commentResponse[]> {
    const res = await apiClient.get(`comment/${id}`)
    return res.data
}