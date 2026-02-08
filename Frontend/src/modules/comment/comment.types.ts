import { UserResponse } from "../auth/auth.types"

export type createCommentProps = {onCancel: () => void, onCreate: (comment: any) => void, cardId:string}

export type CommentProps = {comment:commentResponse}

export type createCommentRequest = {
    cardId: string
    text:string
}

export type commentResponse = {
    _id:string,
    cardId:string,
    author:UserResponse,
    text:string,
    createdAt: Date
    updatedAt: Date
}