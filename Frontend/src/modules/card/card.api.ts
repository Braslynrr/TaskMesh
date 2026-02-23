import { apiClient } from "@/lib/api-client"
import { createCardRequest, cardResponse, getCardsRequest, assignToCardRequest, moveCardRequest, updateCardRequest } from "./card.types"
import { DeleteResponse } from "../general/general.types"

export async function createCard(data:createCardRequest): Promise<cardResponse> {
    const res = await apiClient.post(`card/create`, data)
    return res.data
}

export async function getCards(data:getCardsRequest): Promise<cardResponse[]> {
    const res = await apiClient.get(`card/${data._id}`)
    return res.data
}

export async function assignToCard(data:assignToCardRequest): Promise<cardResponse> {
    const res = await apiClient.post(`card/assign`, data)
    return res.data
}

export async function deleteCard(id:string): Promise<DeleteResponse>
{
    const res = await apiClient.delete(`card/${id}`)
    return res.data
}

export async function moveCard(data:moveCardRequest): Promise<cardResponse> {
    const res = await apiClient.post(`card/move`, data)
    return res.data
}

export async function updateCard(data:updateCardRequest): Promise<cardResponse> {
    const res = await apiClient.patch(`card/`, data)
    return res.data
}