import { CommentProps } from "@/modules/comment/comment.types";
import UserAvatar from "../user/user.avatar";
import { deleteComment, updateComment } from "@/modules/comment/comment.api";
import { useState } from "react";
import { extractApiErrorMessage } from "@/lib/api-error";


export default function Comment({ comment, user, taskboardOwner, onDelete, onModify }: CommentProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(comment.text)
    const [error, setError] = useState("")

    async function deleteOne() {

        try {
            const res = await deleteComment(comment._id)
            onDelete(comment)
        } catch (err) {
            setError(extractApiErrorMessage(err))
        }
    }

    async function updateOne() {
        try {
            const body = { _id: comment._id, text }
            const res = await updateComment(body)
            onModify(res)
            setIsEditing(false)
        } catch (err) {
            setError(extractApiErrorMessage(err))
        }

    }

    const canModify = comment.author._id === user._id

    const canDelete = user._id == taskboardOwner._id || canModify

    const formattedDate = new Date(comment.updatedAt).toLocaleString("es-CR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", })

    return <div className="group/comment text-sm bg-white border border-gray-200 rounded-xl p-3 space-y-1 shadow-sm">
        <span className="text-red-700">{error}</span>
        <div className="flex flex-row items-center gap-2">
            <UserAvatar user={comment.author} />
            <span className="text-gray-400 text-xs opacity-0 group-hover/comment:opacity-100 transition">
                {formattedDate}
            </span>
            {canDelete && <button onClick={deleteOne} className="ml-auto opacity-0 group-hover/comment:opacity-100 transition hover:opacity-85">🗑️</button>}
        </div>
        <div className="flex flex-col">
            {!isEditing ? <p className="text-gray-700">{text}</p> : <textarea className="bg-gray-50 border border-gray-100 rounded-md" value={text} onChange={(e) => setText(e.target.value)} />}
            {canModify && !isEditing && <button onClick={() => setIsEditing(true)} className="self-end text-blue-800 opacity-0 group-hover/comment:opacity-100 transition hover:text-blue-500">✎</button>}
            {canModify && isEditing &&
                <div className="self-end gap-0.5 p-0.5 text-white">
                    <button onClick={() => setIsEditing(false)} className="text-red-700 px-0.5 hover:text-red-500">Cancel</button>
                    <button onClick={updateOne} className="text-green-700 px-0.5 hover:text-green-500">Update</button>
                </div>}
        </div>
    </div>
}