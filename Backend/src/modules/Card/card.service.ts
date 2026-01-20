import { ForbiddenError, NotFoundError } from "../../core/errors/errors";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { ListRepository } from "../List/list.repository";
import { assertUserIsMember, assertUserIsOwner } from "../Taskboard/taskboard.policy";
import { taskboardRepository } from "../Taskboard/taskboard.repository";
import { assertUserCanHandleCards } from "./card.policy";
import { cardRepository } from "./card.repository";
import { assignUsersToCardDTO, createCardDTO, moveFromListDTO, updateCardDTO } from "./card.schema";
import { serializeCard } from "./card.serializer";


export async function completePolicyCheck(userId:string ,cardId:string, policyFunction:Function, functionParams:{} = undefined){

    const card = await cardRepository.getCardByID(cardId)

    if(!card){
        throw new NotFoundError("card does not exist")
    }

    const x = card.assignedTo.map(id => id.toString())

    const list = await ListRepository.getListById(card.listId.toString())
    
    if(!list){
        throw new NotFoundError("Card assigned list does not exist or was removed")
    }

    const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

    policyFunction({card, list, taskboard, userId, ...functionParams})

    return {card, list, taskboard}
} 


export const cardService = {
    
    

    async getCards(listId:mongoIdDTO, userId:string){
        const list = await ListRepository.getListById(listId._id)
        
        if(!list){
            return []
        }

        const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

        if(!taskboard){
            return []
        }

        assertUserIsMember({taskboard, userId})

        const cards = await cardRepository.getCardsByListId(listId._id)
        return cards.map(card => serializeCard(card))
    },

    async createCard(data: createCardDTO, userId:string ){

        const list = await ListRepository.getListById(data.listId)
        
        if(!list){
           throw new NotFoundError("list does not exist")
        }

        const taskboard = await taskboardRepository.findbyId(list.taskboardId.toString())

        if(!taskboard){
           throw new NotFoundError("taskboard does not exist")
        }

        assertUserIsMember({taskboard, userId})


        const card = await cardRepository.createCard({createdBy:userId, ...data})
        return serializeCard(card)
    },

    async deleteCard(cardId:mongoIdDTO, userId:string){
        
        await completePolicyCheck(userId, cardId._id, assertUserCanHandleCards)

        const result = cardRepository.delete(cardId._id)
        return result
    },

    async assingUsersToCard(data:assignUsersToCardDTO, userId:string){

        const {taskboard} = await completePolicyCheck(userId, data._id, assertUserIsOwner)

        const idList = taskboard.members.map(id => id.toString())

        const notMemberList = data.assignedTo.filter(id => !taskboard.ownerId.equals(id) && !idList.includes(id))

        if(notMemberList.length > 0){
           throw new ForbiddenError(`the following users are not members of this taskboard: ${notMemberList.join(", ")}`)
        }

        const updatedcard =  await cardRepository.assingUsersToCard(data)

        return serializeCard(updatedcard)
    },

    async updateCard(data: updateCardDTO, userId:string){

        await completePolicyCheck(userId, data._id, assertUserCanHandleCards)

        const updatedCard = await cardRepository.updateCard(data)
        return serializeCard(updatedCard)

    },

    async moveFromList(data: moveFromListDTO, userId:string){

        const list = await ListRepository.getListById(data.listId)

        if(!list){
           throw new NotFoundError("the given list does not exist")
        }

        const {taskboard} = await completePolicyCheck(userId, data._id, assertUserCanHandleCards)

        if(!taskboard._id.equals(list.taskboardId)){
            throw new ForbiddenError("the lists do not belong to the same taskboard")
        }

        const card = await cardRepository.moveFromList(data)
        return serializeCard(card)
    }
}