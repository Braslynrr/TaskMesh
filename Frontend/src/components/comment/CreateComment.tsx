import { createComment } from "@/modules/comment/comment.api";
import { createCommentProps } from "@/modules/comment/comment.types";
import { useState } from "react";



export default function CreateComment({onCancel, onCreate, cardId} : createCommentProps){
    const [comment, setComment] = useState("")

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        
        try{
            const data = {
                cardId: cardId,
                text: comment
            }

            const res = await createComment(data)
            onCreate(res)
            onCancel()
        }catch(e){

        }
    }

    return <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-2 text-white"> 

            <textarea value={comment} onChange={ (e)=> setComment(e.target.value)} className="border border-gray-200 text-sm text-gray-600 bg-gray-50 rounded-lg p-3" name="comment" placeholder="Comment"/>
            <div className="grid grid-cols-2">
                <button className="bg-red-600 rounded-2xl px-1 py-1 hover:bg-red-800" onClick={onCancel}>Cancel</button>
                <button className="bg-green-700 rounded-2xl px-1 py-1 hover:bg-green-900">Create</button>
            </div>
        </form>

}