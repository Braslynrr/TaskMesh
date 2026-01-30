"use client"


import { CreateTaskboard } from "@/components/taskboard/createTaskboard"
import { Taskboard } from "@/components/taskboard/taskboard"
import { extractApiErrorMessage } from "@/lib/api-error"
import { getTaskboards } from "@/modules/taskboard/taskboard.api"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { useEffect, useState } from "react"

export default function TaskBoardPage() {
    const [taskboards, setTaskboards] = useState<TaskboardResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
    async function loadTaskboards() {
      try {
        const data = await getTaskboards()
        console.log(data)
        setTaskboards(data)
      } catch (err) {
        setError(extractApiErrorMessage(err))
      }
      finally{
        setLoading(false)
      }
    }

    loadTaskboards()
  }, [])
    
    if (loading) return <p>Loading taskboards...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              
                <CreateTaskboard key="creator" onCreated={ (taskboard) => setTaskboards([...taskboards, taskboard]) }/>

                {taskboards.map(tb => (
                    <Taskboard key={tb._id} tb={tb} onDelete={ (taskboard) => setTaskboards( (prev => prev.filter(task => task._id !== taskboard._id)) ) } />
                  ))
                }
             
            </div>
          )
}