import { serializeComment } from "../../modules/Comment/comment.serializer";
import { commentRepository } from "../../modules/Comment/comment.repository";


export async function createComment(userId:string, cardId:string, text:string="test") {
    const comment = await commentRepository.createComment({authorId:userId, cardId:cardId, text:text}) 
    return  serializeComment(comment) 
}