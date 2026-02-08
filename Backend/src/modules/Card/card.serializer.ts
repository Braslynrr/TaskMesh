import { serializeUser } from "../Users/user.serializer"
import { CardDoc, CardResponse } from "./card.types"

export function serializeCard(card: CardDoc): CardResponse {
  return {
    _id: card._id.toString(),
    title: card.title,
    description: card.description,
    listId: card.listId.toString(),
    createdBy: serializeUser(card.createdBy),
    assignedTo: card.assignedTo.map(user => serializeUser(user)),
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  }
}