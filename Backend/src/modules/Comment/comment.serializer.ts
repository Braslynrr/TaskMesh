import { CommentResponse } from "./comment.types";


export function commentSerializer(comment:any): CommentResponse
{
    return {
        _id: comment._id.toString(),
        cardId: comment.cardId.toString(),
        authorId: comment.authorId.toString(),
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    }

}