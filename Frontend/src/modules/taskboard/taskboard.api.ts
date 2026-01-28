import { apiClient } from "@/lib/api-client"
import { createListRequest, createTaskboardRequest, DeleteResponse, deleteTaskboardRequest, ListResponse, moveListRequest, TaskboardResponse } from "./taskboard.types"

export async function getTaskboards(): Promise<TaskboardResponse[]> {
    const res = await apiClient.get("/taskboard")
    return res.data
}


export async function createTaskboard(data:createTaskboardRequest): Promise<TaskboardResponse> {
    const res = await apiClient.post("/taskboard/create", data)
    return res.data
}


export async function deleteTaskboard(id:string): Promise<DeleteResponse> {
    const res = await apiClient.delete(`taskboard/${id}`)
    return res.data
}

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