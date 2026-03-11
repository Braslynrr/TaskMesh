import { extractApiErrorMessage } from "@/lib/api-error";
import { createComment } from "@/modules/comment/comment.api";
import { createCommentProps } from "@/modules/comment/comment.types";
import { useState } from "react";
import { Message } from "../message/message";



export default function CreateComment({ onCancel, onCreate, cardId }: createCommentProps) {
    const [comment, setComment] = useState("")
    const [error, setError] = useState("")
    const [disabled, setDisabled] = useState(false)

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()

        try {
            setDisabled(true)
            setError("")
            const data = {
                cardId: cardId,
                text: comment
            }

            const res = await createComment(data)
            onCreate(res)
            onCancel()
        } catch (err) {
            setError(extractApiErrorMessage(err))
        }
        setDisabled(false)

    }

    return <form onSubmit={handleSubmit} className="flex flex-col p-2 gap-2 text-white">
        {error && <Message type="error" message={error} onClose={() => setError("")} />}
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="border border-gray-200 text-sm text-gray-600 bg-gray-50 rounded-lg p-3" name="comment" placeholder="Comment" required />
        <div className="grid grid-cols-2">
            <button className="text-red-700 rounded-2xl px-1 py-1 hover:text-red-500" onClick={onCancel}>Cancel</button>
            <button className="text-green-700 rounded-2xl px-1 py-1 hover:text-green-500" disabled={disabled}>Create</button>
        </div>
    </form>

}