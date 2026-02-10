import { extractApiErrorMessage } from "@/lib/api-error"
import { createTaskboard } from "@/modules/taskboard/taskboard.api"
import { createTaskboardSchema } from "@/modules/taskboard/taskboard.schemas"
import { CreateTaskboardProps } from "@/modules/taskboard/taskboard.types"
import { useState } from "react"

export function CreateTaskboard({ onCreated }: CreateTaskboardProps) {
  const [error, setError] = useState("")
  const [name, setName] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setError("")
      const parsed = createTaskboardSchema.parse({ name })
      const newTaskboard = await createTaskboard(parsed)
      onCreated(newTaskboard)
      setName("")
    }
    catch (err) {
      setError(extractApiErrorMessage(err))
    }
  }


  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-950/5">
      <div className="h-max w-full rounded gap-3 p-2 text-black text-center items-center" >

        <h6 className="font-bold antialiased md:text-lg lg:text-xl">
          Create Taskboard
        </h6>
        <span className="text-red-700">{error}</span>
        <form onSubmit={handleSubmit}>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Taskboard name"
            className="w-full rounded-md border py-1 bg-gray-100 text-center" required />

          <button type="submit" className="font-sans py-1 text-md text-green-800 hover:text-green-500">
            Create
          </button>
        </form>
      </div>
    </div>
  )
}
