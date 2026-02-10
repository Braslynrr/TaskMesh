import { extractApiErrorMessage } from "@/lib/api-error";
import { createComment } from "@/modules/comment/comment.api";
import { createCommentProps } from "@/modules/comment/comment.types";
import { useState } from "react";



export default function CreateComment({onCancel, onCreate, cardId} : createCommentProps){
    const [comment, setComment] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        
        try{
            setError("")
            const data = {
                cardId: cardId,
                text: comment
            }

            const res = await createComment(data)
            onCreate(res)
            onCancel()
        }catch(err){
            setError(extractApiErrorMessage(err))
        }
    }

    return <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-2 text-white"> 
            <span className="text-red-700">{error}</span>
            <textarea value={comment} onChange={ (e)=> setComment(e.target.value)} className="border border-gray-200 text-sm text-gray-600 bg-gray-50 rounded-lg p-3" name="comment" placeholder="Comment" required/>
            <div className="grid grid-cols-2">
                <button className="text-red-700 rounded-2xl px-1 py-1 hover:text-red-500" onClick={onCancel}>Cancel</button>
                <button className="text-green-700 rounded-2xl px-1 py-1 hover:text-green-500">Create</button>
            </div>
        </form>

}