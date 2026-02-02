"use client"

import { UserResponse } from "@/modules/auth/auth.types"
import { addMemberToTaskboard } from "@/modules/taskboard/taskboard.api"
import { useState } from "react"

export function ManageMembersSection({
  taskboardId,
  members: initialMembers,
}: {
  taskboardId: string
  members: UserResponse[]
}) {
  const [members, setMembers] = useState(initialMembers)
  const [username, setUsername] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try{

        const data = {_id:taskboardId, members:[username]}
        const taskboard = await addMemberToTaskboard(data)
        setMembers(taskboard.members)
        setUsername("")
    } catch(e){
        console.log(e)
    }
    
  }

  return (
    <div className="flex gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border rounded-2xl px-3"
          placeholder="username"
        />
        <button className="border rounded-2xl px-3">
          Add member
        </button>
      </form>

      <select className="border rounded-2xl px-3 bg-black">
        {members.length > 0 ? (
          members.map(m => (
            <option key={m._id}>{m.username}</option>
          ))
        ) : (
          <option>No members yet</option>
        )}
      </select>
    </div>
  )
}
