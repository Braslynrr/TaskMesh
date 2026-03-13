import { useActivityStore } from "@/stores/activityStore";
import { ActivityFeed } from "./activityFeed";


export function ActivityHistory({ close }: { close: () => void }) {

    const activities = useActivityStore(s => s.activities)
    const ClearActivities = useActivityStore(s => s.ClearActivities)

    return <div className="fixed right-0 top-0 h-full w-80 bg-gray-700 border-l shadow-xl z-50">

        <div className="flex items-center justify-between p-4 border-b font-semibold">
            <span>Activity History</span>

            <div className="flex items-center gap-2">
                <button
                    className="opacity-70 hover:opacity-100 transition"
                    onClick={ClearActivities}
                    title="Clear activity"
                >
                    🗑️
                </button>

                <button
                    className="px-2 py-1 rounded bg-red-500 text-gray-100 hover:bg-red-600 transition"
                    onClick={close}
                    title="Close"
                >
                    ✕
                </button>
            </div>
        </div>

        {activities.map(activity => <ActivityFeed key={crypto.randomUUID()} activity={activity} />)}

    </div>

}