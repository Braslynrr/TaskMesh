import { cardRepository } from "../../modules/Card/card.repository";


export async function createCard(listId:string, ownerId:string, title:string="test", description:string = "test", userList:string[] = []) {

    const card = await cardRepository.createCard({listId:listId, title:title, description:description, createdBy:ownerId})

    const assignedCard = await cardRepository.assingUsersToCard({_id: card._id.toString(), assignedTo: userList})

    return assignedCard
}