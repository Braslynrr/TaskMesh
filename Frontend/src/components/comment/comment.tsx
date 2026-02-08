import { CommentProps } from "@/modules/comment/comment.types";
import UserAvatar from "../user/user.avatar";


export default function Comment({ comment }: CommentProps) {


    const formattedDate = new Date(comment.updatedAt).toLocaleString("es-CR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", })

    return <div className="group/comment text-sm bg-white border border-gray-200 rounded-xl p-3 space-y-1 shadow-sm">
        <div className="flex items-center gap-2">
            <UserAvatar user={comment.author} />
            <span className="text-gray-400 text-xs opacity-0 group-hover/comment:opacity-100 transition">
                {formattedDate}
            </span>
        </div>

        <p className="text-gray-700">{comment.text}</p>
    </div>
}