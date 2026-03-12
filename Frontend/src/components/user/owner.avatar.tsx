import { UserResponse } from "@/modules/auth/auth.types";
import UserAvatar from "./user.avatar";


export default function OwnerUserAvatar({ user, displayConnected }: { user: UserResponse, displayConnected?: boolean }) {

    return (
        <div
            key={user._id}
            className="relative flex gap-1 hover:shadow px-1 py-1 rounded-2xl"
        >
            <UserAvatar user={user} displayConnected={displayConnected} />

            <button className="absolute -top-1 text-yellow-400 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                ♛
            </button>
        </div>
    )

} 