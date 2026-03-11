"use client"

import { deleteTaskboard } from "@/modules/taskboard/taskboard.api";
import { TaskboardProps } from "@/modules/taskboard/taskboard.types";
import { useRouter } from "next/navigation"
import UserAvatar from "../user/user.avatar";
import { useState } from "react";
import { extractApiErrorMessage } from "@/lib/api-error";
import { Message } from "../message/message";



export function Taskboard({ tb, onDelete }: TaskboardProps) {
  const [error, setError] = useState("")
  const [members, _] = useState([tb.owner, ...tb.members])
  const router = useRouter()

  async function goToTaskboard() {
    if (!tb._id)
      return

    router.push(`/taskboard/${tb._id}`)

  }

  async function handleDelete() {
    try {

      const res = await deleteTaskboard(tb._id)
      onDelete(tb)
    }
    catch (err) {
      setError(extractApiErrorMessage(err))
    }
  }

  return (
    <div
      className="group/taskboard  min-w-xs min-h-40 rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-950/5 transition hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
      onClick={goToTaskboard}
    >
      <div className="relative px-4 py-3">

        {error && <Message type="error" message={error} onClose={() => setError("")} />}

        <h3 className="text-lg font-semibold text-black wrap-break-word">
          {tb.name}
        </h3>

        <div className="flex -space-x-2 mt-2">
          {members.map(member => (
            <UserAvatar key={member._id} user={member} />
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          className="absolute top-2 right-2 opacity-0 group-hover/taskboard:opacity-100 transition hover:opacity-80"
        >
          🗑️
        </button>

      </div>
    </div>
  )
}
