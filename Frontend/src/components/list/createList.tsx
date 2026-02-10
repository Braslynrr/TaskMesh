import { extractApiErrorMessage } from "@/lib/api-error"
import { createList } from "@/modules/list/list.api"
import { createListSchema } from "@/modules/list/list.schemas"
import { CreateListProps } from "@/modules/list/list.types"
import { useState } from "react"

export function CreateList({ taskboardId, onCreate }: CreateListProps) {
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
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-gray-100 p-3 rounded-2xl">
      <span className="text-red-700">{error}</span>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border rounded-2xl text-center border-gray-300 text-black"
        placeholder="Title"
      />

      <button className="text-green-500 hover:text-green-700">Create List</button>
    </form>
  )
}