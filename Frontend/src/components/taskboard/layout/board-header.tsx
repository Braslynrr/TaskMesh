"use client"

import { UserLoggedIn } from "@/components/user/user.login"
import { ManageMembersSection } from "../manageMembersSection"
import Link from "next/link"
import { useState } from "react"
import { useTaskboardStore } from "@/stores/taskboardStore"

export function BoardHeader({ title, taskboardId }: {
  title: string
  taskboardId?: string
}) {

  const [menuOpen, setMenuOpen] = useState(false)
  const taskboard = useTaskboardStore(s=> s.taskboard)

  return (
    <>
      <header className="grid grid-cols-3 items-center border-b px-4 py-2">

        <div>
          <Link href="/taskboard" className="font-medium underline">
            {title}
          </Link>
          {taskboard && <span> 📑{taskboard.name}</span>}
        </div>

        <button
          className="md:hidden col-start-3 justify-self-end text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-4">
          {taskboardId && (
            <ManageMembersSection taskboardId={taskboardId} />
          )}
        </div>
        <div className="hidden md:flex justify-self-end gap-4">

          <UserLoggedIn />

        </div>

      </header>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 border-b px-4 py-3 bg-gray-800">
          {taskboardId && (
            <ManageMembersSection mobile taskboardId={taskboardId} />
          )}

          <div className="justify-self-end">
            <UserLoggedIn mobile/>
          </div>
        </div>
      )}
    </>
  )
}