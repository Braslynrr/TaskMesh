import { ForbiddenError, NotFoundError } from "../../core/errors/errors";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { commentRepository } from "../Comment/comment.repository";
import { ListRepository } from "../List/list.repository";
import { assertUserIsMember, assertUserIsOwner } from "../Taskboard/taskboard.policy";
import { taskboardRepository } from "../Taskboard/taskboard.repository";
import { assertUserCanHandleCards } from "./card.policy";
import { cardRepository } from "./card.repository";
import { assignUsersToCardDTO, createCardDTO, moveFromListDTO, updateCardDTO } from "./card.schema";
import { serializeCard } from "./card.serializer";
import { CardDoc, CardObject } from "./card.types";


export async function completePolicyCheck(userId: string, cardId: string, policyFunction: Function, functionParams: {} = undefined) {

    const card = await cardRepository.getCardByID(cardId)

    if (!card) {
        throw new NotFoundError("card does not exist")
    }

    const list = await ListRepository.getListById(card.listId.toString())

    if (!list) {
        throw new NotFoundError("Card assigned list does not exist or was removed")
    }

    const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

    policyFunction({ card, list, taskboard, userId, ...functionParams })

    return { card, list, taskboard }
}


export const cardService = {

    async getCards(listId: mongoIdDTO, userId: string) {
        const list = await ListRepository.getListById(listId._id)

        if (!list) {
            return []
        }

        const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

        if (!taskboard) {
            return []
        }

        assertUserIsMember({ taskboard, userId })

        const cards = await cardRepository.getCardsByListId(listId._id)

        const populatedCards = await Promise.all( cards.map( card => cardService.populateDoc(card)))

        return populatedCards.map(card => serializeCard(card))
    },

    async createCard(data: createCardDTO, userId: string) {

        const list = await ListRepository.getListById(data.listId)

        if (!list) {
            throw new NotFoundError("list does not exist")
        }

        const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

        if (!taskboard) {
            throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({ taskboard, userId })


        const newCard = await cardRepository.createCard({ createdBy: userId, ...data })

        
        const populatedCard = await cardService.populateDoc(newCard)

        return serializeCard(populatedCard)
    },

    async deleteCard(cardId: mongoIdDTO, userId: string) {

        await completePolicyCheck(userId, cardId._id, assertUserCanHandleCards)

        const result = cardRepository.delete(cardId._id)
        return result
    },

    async assingUsersToCard(data: assignUsersToCardDTO, userId: string) {

        const { taskboard } = await completePolicyCheck(userId, data._id, assertUserIsOwner)

        const idList = taskboard.members.map(id => id.toString())

        const notMemberList = data.assignedTo.filter(id => !taskboard.ownerId.equals(id) && !idList.includes(id))

        if (notMemberList.length > 0) {
            throw new ForbiddenError(`the following users are not members of this taskboard: ${notMemberList.join(", ")}`)
        }

        const updatedCard = await cardRepository.assingUsersToCard(data)

        const populatedCard = await cardService.populateDoc(updatedCard)

        return serializeCard(populatedCard)
    },

    async updateCard(data: updateCardDTO, userId: string) {

        await completePolicyCheck(userId, data._id, assertUserCanHandleCards)

        const updatedCard = await cardRepository.updateCard(data)

        const populatedCard = await cardService.populateDoc(updatedCard)

        return serializeCard(populatedCard)

    },

    async moveFromList(data: moveFromListDTO, userId: string) {

        const list = await ListRepository.getListById(data.listId)

        if (!list) {
            throw new NotFoundError("the given list does not exist")
        }

        const { taskboard } = await completePolicyCheck(userId, data._id, assertUserCanHandleCards)

        if (!taskboard._id.equals(list.taskboardId)) {
            throw new ForbiddenError("the lists do not belong to the same taskboard")
        }

        const newCard = await cardRepository.moveFromList(data)

        const populatedCard = await cardService.populateDoc(newCard)

        return serializeCard(populatedCard)
    },

    async populateDoc(doc: CardDoc): Promise<CardObject> {
        const card = await doc.populate([{ path: "createdBy", select: "_id username role" }, { path: "assignedTo", select: "_id username role" }])
        const count = await commentRepository.getCommentsNumberById(doc._id.toString())
        const cardObject = card.toObject()
        cardObject.comments = count
        return cardObject
    }
}