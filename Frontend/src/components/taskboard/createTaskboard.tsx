import { extractApiErrorMessage } from "@/lib/api-error"
import { createTaskboard } from "@/modules/taskboard/taskboard.api"
import { createTaskboardSchema } from "@/modules/taskboard/taskboard.schemas"
import { CreateTaskboardProps } from "@/modules/taskboard/taskboard.types"
import { useState } from "react"
import { Message } from "../message/message"

export function CreateTaskboard({ onCreated, onCancel }: CreateTaskboardProps) {
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [disabled, setDisabled] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setDisabled(true)
      setError("")
      const parsed = createTaskboardSchema.parse({ name })
      const newTaskboard = await createTaskboard(parsed)
      onCreated(newTaskboard)
      setName("")
      onCancel()
    }
    catch (err) {
      setError(extractApiErrorMessage(err))
    }
    setDisabled(false)
  }


  return (
    <div className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5">
      <div className="flex flex-col gap-3 text-center text-black">

        <h2 className="text-lg font-semibold">
          Create Taskboard
        </h2>

        {error && <Message type="error" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Taskboard name"
            className="w-full rounded-2xl border py-1 bg-gray-100 text-center" required />
          <div className="grid grid-cols-2">
            <button
              type="submit"
              className="rounded-md text-green-800 py-2 hover:text-green-500"
              disabled={disabled}
            >
              Create
            </button>

            <button type="button" className="rounded-md text-red-800 py-2 hover:text-red-500" onClick={onCancel} >Cancel</button>

          </div>

        </form>
      </div>
    </div>
  )
}
