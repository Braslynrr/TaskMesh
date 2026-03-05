import { apiClient } from "@/lib/api-client"
import { createListRequest, listResponse, moveListRequest, updateListRequest } from "./list.types"
import { DeleteResponse } from "../general/general.types"

export async function getList(id:string) : Promise<listResponse[]> {
    const res = await apiClient.get(`list/${id}`)
    return res.data
}

export async function createList(data:createListRequest) : Promise<listResponse> {
    const res = await apiClient.post(`list/create`, data)
    return res.data
}

export async function moveList(data:moveListRequest): Promise<listResponse[]> {
    const res = await apiClient.post(`list/move`, data)
    return res.data
}

export async function deleteList(id:string): Promise<DeleteResponse> {
    const res = await apiClient.delete(`list/${id}`)
    return res.data
}

export async function updateList(data:updateListRequest): Promise<listResponse> {
    const res = await apiClient.patch(`list/`, data)
    return res.data
}