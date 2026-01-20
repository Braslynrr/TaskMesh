import { CardResponse } from "./card.types"

export function serializeCard(card: any): CardResponse {
  return {
    _id: card._id.toString(),
    title: card.title,
    description: card.description,
    listId: card.listId.toString(),
    createdBy: card.createdBy.toString(),
    assignedTo: card.assignedTo.map(id => id.toString()),
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  }
}