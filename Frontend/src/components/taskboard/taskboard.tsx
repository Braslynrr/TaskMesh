"use client"

import { deleteTaskboard } from "@/modules/taskboard/taskboard.api";
import { TaskboardProps} from "@/modules/taskboard/taskboard.types";
import { useRouter } from "next/navigation"



export function Taskboard({ tb, onDelete }: TaskboardProps) {
  
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
          //setError(extractApiErrorMessage(err))
        }
  }

  const membersLabel =
  tb.members.length > 0
    ? tb.members.join(", ")
    : ""

  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-950/5" onClick={goToTaskboard}>
        <div className="h-max w-full rounded px-3 py-2 text-black">
            <h6 className="font-sans text-base font-bold text-current antialiased md:text-lg lg:text-xl">
            {tb.name}
            </h6>
            <p className="my-1 font-sans text-base text-slate-600 antialiased">
            Members: {membersLabel}
            </p>
        </div>
        <div className="w-full rounded px-3 pb-3 pt-1.5">
            
            <button onClick={(e) => {
                                      e.stopPropagation()
                                      handleDelete()}
                            } className="inline-flex rounded-md border border-slate-800 bg-slate-800 px-4 py-2 text-center font-sans text-sm font-medium text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none">
              Delete
            </button>
        </div>
    </div>
  )
}
