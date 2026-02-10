"use client"

import { deleteTaskboard } from "@/modules/taskboard/taskboard.api";
import { TaskboardProps} from "@/modules/taskboard/taskboard.types";
import { useRouter } from "next/navigation"
import UserAvatar from "../user/user.avatar";
import { useState } from "react";
import { extractApiErrorMessage } from "@/lib/api-error";



export function Taskboard({ tb, onDelete }: TaskboardProps) {
  const [error, setError] = useState("")
  const [members, setMembers] = useState([tb.owner, ... tb.members])
  const router = useRouter()
  
  async function goToTaskboard() {
    if(!tb._id)
      return

    router.push(`/taskboard/${tb._id}`)
    
  }

  async function handleDelete()
  {
     try {
      
          const res = await deleteTaskboard(tb._id)
          onDelete(tb)
        }
        catch(err) {
          setError(extractApiErrorMessage(err))
        }
  }

  return (
    <div className="group/taskboard w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-950/5" onClick={goToTaskboard}>
        <div className="relative h-max w-full rounded px-3 py-2 text-black">
            <span className="text-red-700">{error}</span>
            <h6 className="font-sans text-base font-bold text-current antialiased md:text-lg lg:text-xl">
            {tb.name}
            </h6>
            <div className="flex font-sans text-base text-slate-600 antialiased">
            { members.map(member=> <UserAvatar key={member._id} user={member} />) }
            </div>

            <button onClick={(e) => {
                                      e.stopPropagation()
                                      handleDelete()}
                            } className="absolute top-0 right-0 rounded-md px-4 py-2 text-center font-sans text-sm font-medium transition-all duration-300 opacity-0 hover:opacity-85 group-hover/taskboard:opacity-100">
              🗑️
            </button>
        </div> 
    </div>
  )
}
