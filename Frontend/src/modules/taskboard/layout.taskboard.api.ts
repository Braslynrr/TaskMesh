"use server"

import { cookies } from "next/headers"
import axios from "axios"
import { TaskboardResponse } from "./taskboard.types"

export async function getTaskboard(id: string): Promise<TaskboardResponse | undefined> {
    try {
        const cookieStore = cookies()
        const cookieHeader = (await cookieStore).getAll()
            .map(c => `${c.name}=${c.value}`)
            .join("; ")
        const url = `${process.env.NEXT_PUBLIC_API_URL}/taskboard/${id}`

        const res = await axios.get(
            url,
            {
                headers: {
                    Cookie: cookieHeader,
                },
            })

        return res.data
    } catch (e) {
        return undefined
    }
}
