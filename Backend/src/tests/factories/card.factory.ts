import { cardRepository } from "../../modules/Card/card.repository";


export async function createCard(listId:string, ownerId:string, title:string="test", description:string = "test") {

    const card = await cardRepository.createCard({listId:listId, title:title, description:description, createdBy:ownerId})

    return card
}