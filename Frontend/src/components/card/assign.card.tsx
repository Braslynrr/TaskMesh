import { UserResponse } from "@/modules/auth/auth.types";
import { assignCardProps } from "@/modules/card/card.types";
import { useState } from "react";
import { assignToCard } from "@/modules/card/card.api";
import { extractApiErrorMessage } from "@/lib/api-error";
import RemovableUserAvatar from "../user/removable.user.avatar";

export default function AssigCardManager({ onCancel, onAssign, currentAssignedUsers, taskboardUsers, cardId }: assignCardProps) {

    const [assignedUsers, setAssignedUsers] = useState<UserResponse[]>(currentAssignedUsers)
    const [users, setUsers] = useState<UserResponse[]>(taskboardUsers.filter(u => !currentAssignedUsers.some(a => a._id === u._id)))
    const [id, setId] = useState(users[0]?._id ?? "")
    const [error, setError] = useState("")
    const [disabled, setDisabled] = useState(false)


    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setDisabled(true)
        const body = {
            _id: cardId,
            assignedTo: assignedUsers.map(member => member._id)
        }

        try {
            setError("")
            const res = await assignToCard(body)
            console.log()
            onAssign(res)
            onCancel()

        } catch (err) {
            setError(extractApiErrorMessage(err))
        }
        setDisabled(false)

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
        <span className="text-red-700">{error}</span>

        <div className="flex overflow-x-auto gap-1 p-1">
            {assignedUsers.map(member => <RemovableUserAvatar key={member._id} user={member} remove={ () => remove(member._id)} isOwner={true}/>)}
        </div>

        <select value={id} onChange={(e) => setId(e.target.value)} className="border border-gray-400 rounded-lg text-center py-0.5">
            {users.map(member => <option key={member._id} value={member._id}>{member.username}</option>)}
        </select>

        <div className="grid grid-cols-1">
            <button type="button" onClick={assign} className="text-blue-500 hover:text-blue-800">Assign</button>
        </div>
        <div className="grid grid-cols-2">
            <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-800">Cancel</button>
            <button type="submit" className="text-green-500 hover:text-green-800" disabled={disabled}>Save</button>
        </div>

    </form>
}