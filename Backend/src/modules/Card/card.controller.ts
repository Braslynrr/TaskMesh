
import { Response, Request } from "express";
import { mongoIdSchema } from "../../utils/zodObjectId";
import { cardService } from "./card.service";
import { assignUsersToCardSchema, createCardSchema, moveFromListSchema, updateCardSchema } from "./card.schema";



export async function getCards(req: Request, res: Response) {
    const userId = req.user._id
    const { id } = req.params
    const body = { _id: id}
    const data = mongoIdSchema.parse(body)

    const cards = await cardService.getCards(data,userId)
    res.status(200).json(cards)
}

export async function createCard(req: Request, res: Response) {
    const userId = req.user._id
    const data = createCardSchema.parse(req.body)

    const card = await cardService.createCard(data, userId)
    res.status(201).json(card)
}

export async function deleteCard(req: Request, res: Response) {
    const userId = req.user._id
    const { id } = req.params
    const body = { _id: id}
    const data = mongoIdSchema.parse(body)

    const result = await cardService.deleteCard(data, userId)
    res.status(200).json(result)
}

export async function moveFromList(req: Request, res: Response) {
    const userId = req.user._id
    const data = moveFromListSchema.parse(req.body)

    const card = await cardService.moveFromList(data, userId)
    res.status(200).json(card)
    
}

export async function assingUsersToCard(req: Request, res: Response) {
    const userId = req.user._id
    const data = assignUsersToCardSchema.parse(req.body)

    const card = await cardService.assingUsersToCard(data, userId)
    res.status(200).json(card)
}

export async function updateCard(req: Request, res: Response) {
    const userId = req.user._id
    const data = updateCardSchema.parse(req.body)

    const card = await cardService.updateCard(data, userId)
    res.status(200).json(card)
}