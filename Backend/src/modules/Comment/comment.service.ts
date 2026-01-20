import { createCommentDTO, updateCommentDTO } from "./comment.schema";
import { commentRepository } from "./comment.repository";
import { commentSerializer as serializerComment } from "./comment.serializer";
import { mongoIdDTO } from "../../utils/zodObjectId";
import { NotFoundError } from "../../core/errors/errors";
import { completePolicyCheck } from "../Card/card.service";
import { assertUserIsMember, assertUserIsOwner } from "../Taskboard/taskboard.policy";
import { assertUserCanModifyComments, assertUserCanCreateComments } from "./comment.policy";


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

        const comment = await commentRepository.createComment({authorId:userId, ... data})
        return serializerComment(comment)
    },

    async getComments(data:mongoIdDTO, userId:string){

        await completePolicyCheck(userId, data._id, assertUserIsMember)

        const comments = await commentRepository.getCommentsByCardId(data._id)
        return comments.map( comment => serializerComment(comment))
    }, 

    async deleteComment(data: mongoIdDTO, userId:string){

        await completeCommentPolicyCheck(userId, data._id, assertUserCanModifyComments)

        const result = await commentRepository.deleteComment(data._id)
        return result
    },

    async updateComment(data: updateCommentDTO, userId:string) {

        await completeCommentPolicyCheck(userId, data._id, assertUserCanModifyComments)

        const comment = await commentRepository.updateComment(data)
        return serializerComment(comment)
    }
}