import { apiClient } from "@/lib/api-client"
import { getTaskboardResponse } from "./taskboard.types"

export async function getTaskboards(): Promise<getTaskboardResponse[]> {
    const res = await apiClient.get("/taskboard")
    return res.data
}