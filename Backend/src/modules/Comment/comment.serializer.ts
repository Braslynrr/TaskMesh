import { serializeUser } from "../Users/user.serializer";
import { CommentDoc, CommentResponse } from "./comment.types";


export function commentSerializer(comment:CommentDoc): CommentResponse
{
    return {
        _id: comment._id.toString(),
        cardId: comment.cardId.toString(),
        author: serializeUser(comment.authorId),
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    }

}