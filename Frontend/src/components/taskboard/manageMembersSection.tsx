"use client"

import { extractApiErrorMessage } from "@/lib/api-error"
import { addMemberToTaskboard, getTaskboard, removeTaskboardMember } from "@/modules/taskboard/taskboard.api"
import { useEffect, useState } from "react"
import RemovableUserAvatar from "../user/removable.user.avatar"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import OwnerUserAvatar from "../user/owner.avatar"
import { UserResponse } from "@/modules/auth/auth.types"

export function ManageMembersSection({
  taskboardId,
}: {
  taskboardId: string
}) {

  const [user, setUser] = useState<UserResponse>()
  const [taskboard, setTaskboard] = useState<TaskboardResponse>()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")


  useEffect(() => {
    const data = localStorage.getItem("user")
    if (data) setUser(JSON.parse(data))
  }, [])

  useEffect(() => {
    async function loadTaskboard() {
      try {
        const res = await getTaskboard(taskboardId)
        setTaskboard({ ...res, members: [res.owner, ...res.members] })
      } catch (err) {
        setError(extractApiErrorMessage(err))
      }
    }

    loadTaskboard()

  }, [taskboardId])

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    try {
      setError("")
      const data = { _id: taskboardId, members: [username] }
      const newTaskboard = await addMemberToTaskboard(data)
      setTaskboard({ ...newTaskboard!, members: [taskboard!.members[0], ...newTaskboard.members] })
      setUsername("")
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }

  }

  async function removeMember(id: string, userId: string) {
    try {
      setError("")
      const newTaskboard = await removeTaskboardMember(id, userId)
      setTaskboard({ ...newTaskboard!, members: [taskboard!.members[0], ...newTaskboard.members] })
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }
  }

  let isOwner = user?._id === taskboard?.owner._id

  return (
    <div className="flex flex-col gap-3">

      {error && <span className="text-red-700">{error}</span>}

      <div className="flex flex-row">

        <div className="flex items-center gap-2">

          <div className="flex flex-wrap gap-2">
            {taskboard && taskboard.members.map(member => (
              member._id === taskboard.owner._id ?
                <OwnerUserAvatar key={member._id} user={member} />
                :
                < RemovableUserAvatar
                  key={member._id}
                  user={member}
                  isOwner={isOwner}
                  remove={() => removeMember(taskboardId, member._id)}
                />
            ))}
          </div>
        </div>

        {isOwner && <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            name="username"
            autoComplete="off"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border rounded-xl px-3 py-1"
            placeholder="Add member by username"
          />

          <button className="border rounded-xl px-3 hover:bg-gray-800 hover:text-white">
            Add
          </button>
        </form>}


      </div>
    </div>
  )
}
