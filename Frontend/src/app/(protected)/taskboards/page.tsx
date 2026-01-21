"use client"

import { extractApiErrorMessage } from "@/lib/api-error"
import { getTaskboards } from "@/modules/taskboard/taskboard.api"
import { getTaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { useEffect, useState } from "react"

export default function TaskBoardPage() {
    const [taskboards, setTaskboards] = useState<getTaskboardResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
    async function loadTaskboards() {
      try {
        const data = await getTaskboards()
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
    
    console.log(taskboards)

    if (loading) return <p>Loading taskboards...</p>
    if (error) return <p className="text-red-500">{error}</p>


    return <div>
      <h1>My Taskboards</h1>
      <ul>
        {taskboards.map( tb => (
          <li key={tb.id}>{tb.name}</li>
        ))}
      </ul>
    </div>
}