import { UserResponse } from "@/modules/auth/auth.types";
import UserAvatar from "./user.avatar";


export default function RemovableUserAvatar({ user, remove, isOwner, displayConnected }: { user: UserResponse, remove: () => void, isOwner: boolean, displayConnected?:boolean }) {

    return (
        <div
            key={user._id}
            className="relative group flex gap-1 hover:shadow px-1 py-1 rounded-2xl"
        >
            <UserAvatar user={user} displayConnected={displayConnected}/>

            {isOwner && <button className="absolute -top-1 -right-1
             bg-white text-red-600 text-xs rounded-full 
             w-4 h-4 
             flex items-center justify-center 
             shadow 
             hover:bg-red-600 hover:text-white 
             cursor-pointer 
             opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={remove}>
                ×
            </button>}
        </div>
    )

} 