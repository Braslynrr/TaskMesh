import { useHighlightStore } from "@/stores/highlightStore"
import UserAvatar from "../user/user.avatar"
import { useTaskboardStore } from "@/stores/taskboardStore"

export function ActivityHighlight({ children, id }: { children: any, id: string }) {

    const highlight = useHighlightStore(s => s.highlights[id])
    const taskboard = useTaskboardStore(s => s.taskboard)

    const author = taskboard?.members.find(member => member._id === highlight?.authorId)

    return (
       <div className="relative group flex-none">

            {highlight && (
                <>
                    <div className="absolute inset-0 z-10 rounded-md bg-blue-400/15 ring-4 ring-blue-500 pointer-events-none animate-pulse" />


                    {highlight.activity && (
                        <div className="absolute -top-1 left-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-2 bg-transparent text-black text-xs px-3 py-1 rounded whitespace-nowrap pointer-events-none">
                            {author && <UserAvatar user={author} />}
                            <span>{highlight.activity}</span>
                        </div>
                    )}
                </>
            )}

            {children}

        </div>
    )
}