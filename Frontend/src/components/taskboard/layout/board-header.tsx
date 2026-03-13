"use client"

import { UserLoggedIn } from "@/components/user/user.login"
import { ManageMembersSection } from "../manageMembersSection"
import Link from "next/link"
import { useState } from "react"
import { useTaskboardStore } from "@/stores/taskboardStore"
import { ActivityHistory } from "@/components/activity/ActivityHistory"

export function BoardHeader({ title, taskboardId }: {
  title: string
  taskboardId?: string
}) {

  const [menuOpen, setMenuOpen] = useState(false)
  const taskboard = useTaskboardStore(s => s.taskboard)
  const [showActivity, setShowActivity] = useState<boolean>(false)

  return (
    <>
      <header className="flex items-center border-b px-4 py-2">

        <div className="flex items-center gap-2">
          <Link href="/taskboard" className="font-medium underline">
            {title}
          </Link>

          {taskboard && (
            <span className="text-gray-300">📑 {taskboard.name}</span>
          )}
        </div>


        <div className="hidden md:flex items-center gap-10 mx-auto">
          {taskboardId && (
            <ManageMembersSection taskboardId={taskboardId} />
          )}

          {taskboardId && !showActivity && (
            <button
              onClick={() => setShowActivity(true)}
              className="text-sm text-slate-300 hover:text-gray-100"
            >
              📜 Activity History
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">

          {showActivity && (
            <ActivityHistory close={() => setShowActivity(false)} />
          )}

          <button
            className="md:hidden text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰ Menu
          </button>

          <div className="hidden md:flex">
            <UserLoggedIn />
          </div>

        </div>

      </header>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 border-b px-4 py-3 bg-gray-800">
          {taskboardId && (
            <ManageMembersSection mobile taskboardId={taskboardId} />
          )}

          {taskboardId && (<button
            onClick={() => {
              setShowActivity(true)
              setMenuOpen(false)
            }}
            className="text-left text-slate-200 hover:text-slate-50"
          >
            📜 Activity History
          </button>
          )}

          <div className="justify-self-end">
            <UserLoggedIn mobile />
          </div>
        </div>
      )}
    </>
  )
}