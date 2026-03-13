import { Activity } from "@/modules/general/general.types";
import { useTaskboardStore } from "@/stores/taskboardStore";

export function ActivityFeed({ activity }: { activity: Activity }) {

    const getUserName = useTaskboardStore(s => s.getAuthorUsername)

    const isYou = activity.author === "You"
    const username = isYou ? activity.author : getUserName(activity.author)

    return (
        <div className="px-4 py-2 border-b text-sm flex gap-2 items-start hover:bg-gray-600/30 transition">

            <span className={`font-semibold ${isYou ? "text-green-300" : "text-yellow-300"}`}>
                {username}
            </span>

            <span className="text-gray-200">
                {activity.action}
            </span>

        </div>
    )
}