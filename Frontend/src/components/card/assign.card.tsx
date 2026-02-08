import { UserResponse } from "@/modules/auth/auth.types";
import { assignCardProps } from "@/modules/card/card.types";
import { useState } from "react";
import UserAvatar from "../user/user.avatar";
import { assignToCard } from "@/modules/card/card.api";

export default function AssigCardManager({ onCancel, onAssign, currentAssignedUsers, taskboardUsers, cardId }: assignCardProps) {

    const [assignedUsers, setAssignedUsers] = useState<UserResponse[]>(currentAssignedUsers)
    const [users, setUsers] = useState<UserResponse[]>(taskboardUsers.filter(u => !currentAssignedUsers.some(a => a._id === u._id))
    )
    const [id, setId] = useState(users[0]?._id ?? "")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const body = {
            _id: cardId,
            assignedTo: assignedUsers.map(member=> member._id)
        }

        try{

            const res = await assignToCard(body)
            console.log()
            onAssign(res)
            onCancel()

        }catch(e){

        }

    }

    function assign() {
        const user = users.find(m => m._id === id)
        if (!user) return

        setAssignedUsers(prev => [...prev, user])

        const newUsers = users.filter(m => m._id !== id)
        setUsers(newUsers)

        setId(newUsers[0]?._id ?? "")
    }

    function remove(id: string) {
        const user = assignedUsers.find(m => m._id === id)
        if (!user) return

        const newAssigned = assignedUsers.filter(m => m._id !== id)
        setAssignedUsers(newAssigned)

        const newUsers = [user, ...users]
        setUsers(newUsers)

        setId(newUsers[0]?._id ?? "")
    }


    return <form onSubmit={handleSubmit} className="flex flex-col p-1 gap-1">

        <div className="flex overflow-x-auto gap-1 p-1">
            {assignedUsers.map(member => <div key={member._id} onClick={() => remove(member._id)} className="flex gap-1 hover:shadow px-1 py-1 rounded-2xl"><UserAvatar user={member} /> <span className="text-red-800 hover:text-red-500">X</span></div>)}
        </div>

        <select value={id} onChange={(e) => setId(e.target.value)} className="border border-gray-400 rounded-lg text-center py-0.5">
            {users.map(member => <option key={member._id} value={member._id}>{member.username}</option>)}
        </select>

        <div className="grid grid-cols-1">
            <button type="button" onClick={assign} className="text-blue-500 hover:text-blue-800">Assign</button>
        </div>
        <div className="grid grid-cols-2">
            <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-800">Cancel</button>
            <button type="submit" className="text-green-500 hover:text-green-800">Save</button>
        </div>

    </form>
}