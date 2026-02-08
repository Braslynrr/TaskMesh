import { UserResponse } from "@/modules/auth/auth.types";


export default function UserAvatar({ user }: { user: UserResponse }) {

    function stringToColor(str: string) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        return `hsl(${hash % 360}, 70%, 50%)`
    }

    return <div className="relative group/avatar">
        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-medium cursor-default"
            style={{ backgroundColor: stringToColor(user.username) }}>
            {user.username[0].toUpperCase()}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded 
                  opacity-0 group-hover/avatar:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
            {user.username}
        </div>
    </div>
}