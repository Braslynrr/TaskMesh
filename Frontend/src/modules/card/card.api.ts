import { apiClient } from "@/lib/api-client"
import { createCardRequest, cardResponse, getCardsRequest } from "./card.types"



export async function createCard(data:createCardRequest): Promise<cardResponse> {
    const res = await apiClient.post(`card/create`, data)
    return res.data
}

export async function getCards(data:getCardsRequest): Promise<cardResponse[]> {
    const res = await apiClient.get(`card/${data._id}`)
    return res.data
}
