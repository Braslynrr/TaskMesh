"use client"

import { cardProps } from "@/modules/card/card.types";
import { useState } from "react";
import CreateComment from "../comment/CreateComment";
import Comment from "../comment/comment";
import { commentResponse } from "@/modules/comment/comment.types";
import { getComments } from "@/modules/comment/comment.api";
import UserAvatar from "../user/user.avatar";
import AssigCardManager from "./assign.card";
import { deleteCard } from "@/modules/card/card.api";


export function Card({ card, user, taskBoardOwner, taskboardMembers, onAssign, onDelete }: cardProps) {
    const [isCreating, setIsCreating] = useState(false)
    const [isManaging, setIsManaging] = useState(false)
    const [comments, setComments] = useState<commentResponse[]>([])

    async function onDeleteCard() {
        try {
            const res = await deleteCard(card._id)
            onDelete(card)
        } catch (e) {

        }
    }

    function onDeleteComment(comment: commentResponse) {
        setComments((prev) => prev.filter(com => com._id !== comment._id))
    }

    function onUpdateComment(comment: commentResponse) {
        setComments((prev) => prev.map(com => com._id === comment._id ? comment : com))
    }

    function handleToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
        const el = e.currentTarget
        if (el.open && comments.length <= 0) {
            loadComments()
        }
    }

    async function loadComments() {

        try {
            const res = await getComments(card._id)
            setComments(res)
        } catch (err) {

        }

    }

    const isTaskboardOwner = user._id === taskBoardOwner._id
    const isCardOwner = card.createdBy._id === user._id

    const canModify =
        isTaskboardOwner ||
        isCardOwner
        ||
        card.assignedTo.some(m => m._id === user._id)


    return (
        <div className="group/card flex flex-col bg-white rounded-xl p-4 shadow-sm gap-4 hover:shadow-md transition">
            <div className="relative">
                <h4 className="font-semibold text-sm text-gray-900 text-center">
                    {card.title}
                </h4>

                {isTaskboardOwner && <button onClick={onDeleteCard} className="absolute opacity-0 -right-2 top-0 group-hover/card:opacity-100 hover:opacity-85">
                    🗑️
                </button>}
            </div>


            <div className="flex flex-col text-sm">
                {!isManaging && (
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-sm text-gray-500">Assigned:</span>

                        {card.assignedTo?.map(member => (
                            <UserAvatar key={member._id} user={member} />
                        ))}

                        {canModify &&
                            <button
                                onClick={() => setIsManaging(true)}
                                className="ml-auto text-blue-700 text-lg text-end hover:text-blue-400">✎</button>}
                    </div>
                )}

                {canModify &&
                    isManaging &&
                    <AssigCardManager
                        cardId={card._id}
                        currentAssignedUsers={card.assignedTo}
                        taskboardUsers={taskboardMembers}
                        onCancel={() => setIsManaging(false)}
                        onAssign={onAssign} />}
            </div>

            {card.description && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {card.description}
                </p>
            )}

            <div className="flex flex-col gap-2 ">

                <details className="group text-xs font-medium" onToggle={handleToggle}>
                    <summary className="uppercase cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                        Comments {card.comments > 0 && `(${card.comments})`}
                    </summary>

                    <div className="mt-2 space-y-2">
                        {comments && comments.map(com => <Comment key={com._id} taskboardOwner={taskBoardOwner} user={user} comment={com} onDelete={onDeleteComment} onModify={onUpdateComment} />)}
                    </div>
                </details>

                {canModify &&
                    <div className="text-xs text-gray-400 italic text-center">
                        {isCreating ?
                            <CreateComment onCancel={() => setIsCreating(false)} onCreate={(comment) => setComments((prev) => [...prev, comment])} cardId={card._id} /> :
                            <button onClick={() => setIsCreating(true)} className="border border-gray-200  rounded-full px-1 hover:border-gray-500"> + </button>
                        }
                    </div>
                }
            </div>

        </div>
    )
}