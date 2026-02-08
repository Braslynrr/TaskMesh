import { cardProps } from "@/modules/card/card.types";
import { useEffect, useState } from "react";
import CreateComment from "../comment/CreateComment";
import Comment from "../comment/comment";
import { commentResponse } from "@/modules/comment/comment.types";
import { getComments } from "@/modules/comment/comment.api";
import UserAvatar from "../user/user.avatar";
import AssigCardManager from "./assign.card";


export function Card({ card, user, taskBoardOwner, taskboardMembers, onAssign }: cardProps) {
    const [isCreating, setIsCreating] = useState(false)
    const [isManaging, setIsManaging] = useState(false)
    const [comments, setComments] = useState<commentResponse[]>()


    useEffect(() => {
        async function loadComments() {

            try {
                const res = await getComments(card._id)
                setComments(res)
            } catch (err) {

            }

        }

        loadComments()
    }, [])

    const canModify =
        user._id === taskBoardOwner._id ||
        card.assignedTo.some(m => m._id === user._id)


    return (
        <div className="flex flex-col bg-white rounded-xl p-4 shadow-sm gap-4 hover:shadow-md transition">

            <h4 className="font-semibold text-sm text-gray-900 text-center">
                {card.title}
            </h4>

            <div className="flex flex-col text-sm">
                {!isManaging && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Assigned:</span>

                        {card.assignedTo?.map(member => (
                            <UserAvatar key={member._id} user={member} />
                        ))}
                    </div>
                )}

                {canModify && (
                    isManaging
                        ? <AssigCardManager
                            cardId={card._id}
                            currentAssignedUsers={card.assignedTo}
                            taskboardUsers={taskboardMembers}
                            onCancel={() => setIsManaging(false)}
                            onAssign={onAssign}
                        />
                        : <button
                            onClick={() => setIsManaging(true)}
                            className="text-blue-700 text-lg text-end hover:text-blue-400">⚙</button>
                )}
            </div>

            {card.description && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {card.description}
                </p>
            )}

            <div className="flex flex-col gap-2 ">

                <details className="group text-xs font-medium">
                    <summary className="uppercase cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                        Comments {comments && comments.length > 0 && `(${comments.length})`}
                    </summary>

                    <div className="mt-2 space-y-2">
                        {comments && comments.map(com => <Comment key={com._id} comment={com} />)}
                    </div>
                </details>

                {canModify &&
                    <div className="text-xs text-gray-400 italic text-center">
                        {isCreating ?
                            <CreateComment onCancel={() => setIsCreating(false)} onCreate={(comment) => setComments((prev) => [prev, comment])} cardId={card._id} /> :
                            <button onClick={() => setIsCreating(true)} className="border border-gray-200  rounded-full px-1 hover:border-gray-500"> + </button>
                        }
                    </div>
                }
            </div>

        </div>
    )
}