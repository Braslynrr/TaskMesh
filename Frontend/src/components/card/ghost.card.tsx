import { ghostCardProps } from "@/modules/card/card.types"
import UserAvatar from "../user/user.avatar"


export function GhostCard({ card }: ghostCardProps) {



    return <div className="group/card flex flex-col bg-white rounded-xl p-4 gap-4 hover:shadow-md transition opacity-80 shadow-xl">


        <div className="relative cursor-grab">
            <h4 className="font-semibold text-sm text-gray-900 text-center" >
                {card.title}
            </h4>
        </div>

        <div className="flex flex-col text-sm">

            <div className="flex flex-row items-center gap-2">
                <span className="text-sm text-gray-500">Assigned:</span>

                {card.assignedTo?.map(member => (
                    <UserAvatar key={member._id} user={member} />
                ))}
            </div>
        </div>


        {card.description && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                {card.description}
            </p>
        )}



        <div className="flex flex-col gap-2 ">

            <details className="group text-xs font-medium">
                <summary className="uppercase cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Comments {card.comments > 0 && `(${card.comments})`}
                </summary>
            </details>
        </div>

    </div>
}