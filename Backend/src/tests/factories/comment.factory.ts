import { commentRepository } from "../../modules/Comment/comment.repository";


export async function createComment(userId:string, cardId:string, text:string="test") {
    const comment =  commentRepository.createComment({authorId:userId, cardId:cardId, text:text})  
    return comment
}