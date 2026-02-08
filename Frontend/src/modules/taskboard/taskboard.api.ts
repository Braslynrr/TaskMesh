import { apiClient } from "@/lib/api-client"
import { AddMemeberToTaskboardRequest, createTaskboardRequest, TaskboardResponse, TaskboardSnapshotResponse } from "./taskboard.types"
import { DeleteResponse } from "../general/general.types"

export async function getTaskboards(): Promise<TaskboardResponse[]> {
    const res = await apiClient.get("/taskboard")
    return res.data
}

export async function getTaskboard(id:string): Promise<TaskboardResponse> {
    const res = await apiClient.get(`/taskboard/${id}`)
    return res.data
}

export async function getTaskboardSnapshot(id:string): Promise<TaskboardSnapshotResponse> {
    const res = await apiClient.get(`/taskboard/${id}/snapshot`)
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


export async function addMemberToTaskboard(data:AddMemeberToTaskboardRequest): Promise<TaskboardResponse> {
    const res = await apiClient.post(`taskboard/add`, data)
    return res.data
}