import { apiClient } from "@/lib/api-client"
import { createListRequest, ListResponse, moveListRequest } from "./list.types"

export async function getList(id:string) : Promise<ListResponse[]> {
    const res = await apiClient.get(`list/${id}`)
    return res.data
}

export async function createList(data:createListRequest) : Promise<ListResponse> {
    const res = await apiClient.post(`list/create`, data)
    return res.data
}

export async function moveList(data:moveListRequest): Promise<ListResponse[]> {
    const res = await apiClient.post(`list/move`, data)
    return res.data
}