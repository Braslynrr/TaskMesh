"use client"


import { Message } from "@/components/message/message"
import { CreateTaskboard } from "@/components/taskboard/createTaskboard"
import { Taskboard } from "@/components/taskboard/taskboard"
import { extractApiErrorMessage } from "@/lib/api-error"
import { getTaskboards } from "@/modules/taskboard/taskboard.api"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { useActivityStore } from "@/stores/activityStore"
import { useTaskboardStore } from "@/stores/taskboardStore"
import { useEffect, useState } from "react"
import { SpinnerCircular } from "spinners-react"

export default function TaskBoardPage() {
  const [taskboards, setTaskboards] = useState<TaskboardResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const setTaskboard = useTaskboardStore(s => s.setTaskboard)
  const ClearActivities = useActivityStore(s => s.ClearActivities)

  useEffect(() => {
    async function loadTaskboards() {
      try {
        const data = await getTaskboards()
        setTaskboards(data)
      } catch (err) {
        setError(extractApiErrorMessage(err))
      }
      finally {
        setLoading(false)
      }
    }
    setTaskboard(undefined)
    ClearActivities()
    loadTaskboards()
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center gap-2 py-6">
        <p>Loading taskboards...</p>
        <SpinnerCircular size={25} />
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center py-6">
        <Message type="error" message={error} onClose={() => setError("")} />
      </div>
    )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

      {taskboards.map(tb => (
        <Taskboard key={tb._id} tb={tb} onDelete={(taskboard) => setTaskboards((prev => prev.filter(task => task._id !== taskboard._id)))} />
      ))
      }

      {!creating ?
        <div
          onClick={() => setCreating(true)}
          className="flex items-center justify-center w-12 h-12 mt-16 rounded-full border border-slate-300 text-slate-500 hover:text-slate-100 cursor-pointer justify-self-center"
        >
          +
        </div>
        :
        <CreateTaskboard key="creator" onCreated={(taskboard) => setTaskboards([...taskboards, taskboard])} onCancel={() => setCreating(false)} />
      }
    </div>
  )
}