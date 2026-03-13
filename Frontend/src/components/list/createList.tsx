import { extractApiErrorMessage } from "@/lib/api-error"
import { createList } from "@/modules/list/list.api"
import { createListSchema } from "@/modules/list/list.schemas"
import { CreateListProps } from "@/modules/list/list.types"
import { useState } from "react"
import { Message } from "../message/message"
import { useActivityStore } from "@/stores/activityStore"

export function CreateList({ taskboardId, onCreate, onCancel }: CreateListProps) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [disabled, setDisabled] = useState(false)
  const addActivity = useActivityStore(s => s.AddActivity)


  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    try {
      setDisabled(true)
      setError("")
      const parsed = createListSchema.parse({ title, taskboardId })
      const list = await createList(parsed)
      onCreate(list)
      addActivity({ author: "You", action: ` have created '${list.title}' list` })
      setTitle("")
      onCancel()
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }
    setDisabled(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-gray-100 p-3 rounded-2xl">
      {error && <Message type="error" message={error} onClose={() => setError("")} />}
      <h3 className="text-black items-center text-center font-semibold">Create List</h3>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border rounded-2xl text-center border-gray-300 text-black"
        placeholder="Title"
      />
      <div className="grid grid-cols-2">
        <button type="button" className="text-red-800 hover:text-red-500" onClick={onCancel}>Cancel</button>
        <button type="submit" className="text-green-800 hover:text-green-500" disabled={disabled}>Create</button>
      </div>
    </form>
  )
}