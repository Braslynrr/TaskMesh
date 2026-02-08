import { createCommentDTO, updateCommentDTO } from "./comment.schema";
import { commentRepository } from "./comment.repository";
import { commentSerializer as serializerComment } from "./comment.serializer";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { NotFoundError } from "../../core/errors/errors";
import { completePolicyCheck } from "../Card/card.service";
import { assertUserIsMember } from "../Taskboard/taskboard.policy";
import { assertUserCanModifyComments, assertUserCanCreateComments } from "./comment.policy";
import { CommentDoc } from "./comment.types";


async function completeCommentPolicyCheck(userId:string ,commentId:string, policyFunction:Function){

    const comment = await commentRepository.getCommentById(commentId)

    if(!comment){
        throw new NotFoundError("comment does not exist")
    }
    
    const cardId = comment.cardId.toString() 

    return {comment, ... await completePolicyCheck(userId, cardId, policyFunction, {comment})}
} 


export const commentService = {

    async createComment(data: createCommentDTO, userId:string){

        await completePolicyCheck(userId, data.cardId, assertUserCanCreateComments)

        const newComment = await commentRepository.createComment({authorId:userId, ... data})

        const populatedComment = await commentService.populateDocument(newComment)
        
        return serializerComment(populatedComment)
    },

    async getComments(data:mongoIdDTO, userId:string){

        await completePolicyCheck(userId, data._id, assertUserIsMember)

        const newComments = await commentRepository.getCommentsByCardId(data._id)

        const populatedComments = await Promise.all( newComments.map(comment => commentService.populateDocument(comment)))
   
        return populatedComments.map( comment => serializerComment(comment))
    }, 

    async deleteComment(data: mongoIdDTO, userId:string){

        await completeCommentPolicyCheck(userId, data._id, assertUserCanModifyComments)

        const result = await commentRepository.deleteComment(data._id)
        return result
    },

    async updateComment(data: updateCommentDTO, userId:string) {

        await completeCommentPolicyCheck(userId, data._id, assertUserCanModifyComments)

        const newComment = await commentRepository.updateComment(data)

        const populatedComment = await commentService.populateDocument(newComment)

        return serializerComment(populatedComment)
    },
    
    async populateDocument(doc: CommentDoc){
        return await doc.populate([{ path: "authorId", select: "_id username role" }])}
}