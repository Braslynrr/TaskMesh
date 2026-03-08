import { extractApiErrorMessage } from "@/lib/api-error"
import { createList } from "@/modules/list/list.api"
import { createListSchema } from "@/modules/list/list.schemas"
import { CreateListProps } from "@/modules/list/list.types"
import { useState } from "react"

export function CreateList({ taskboardId, onCreate, onCancel }: CreateListProps) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setError("")
      const parsed = createListSchema.parse({ title, taskboardId })
      const list = await createList(parsed)
      onCreate(list)
      setTitle("")
      onCancel()
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-gray-100 p-3 rounded-2xl">
      <span className="text-red-700">{error}</span>
      <h3 className="text-black items-center text-center font-semibold">Create List</h3>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border rounded-2xl text-center border-gray-300 text-black"
        placeholder="Title"
      />
      <div className="grid grid-cols-2">
        <button type="button" className="text-red-800 hover:text-red-500" onClick={onCancel}>Cancel</button>
        <button type="submit" className="text-green-800 hover:text-green-500">Create</button>
      </div>
    </form>
  )
}