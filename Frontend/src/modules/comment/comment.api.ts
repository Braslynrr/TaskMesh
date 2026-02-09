import { apiClient } from "@/lib/api-client"
import { commentResponse, createCommentRequest, updateCommentRequest } from "./comment.types";
import { DeleteResponse } from "../general/general.types";

export async function createComment(data:createCommentRequest): Promise<commentResponse> {
    const res = await apiClient.post(`comment/`, data)
    return res.data
}

export async function getComments(id:string): Promise<commentResponse[]> {
    const res = await apiClient.get(`comment/${id}`)
    return res.data
}


export async function deleteComment(id:string): Promise<DeleteResponse> {
    const res = await apiClient.delete(`comment/${id}`)
    return res.data
}

export async function updateComment(data:updateCommentRequest): Promise<commentResponse> {
    const res = await apiClient.patch(`comment/`, data)
    return res.data
}