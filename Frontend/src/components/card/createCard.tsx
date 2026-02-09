import { createCard } from "@/modules/card/card.api"
import { createCardSchema } from "@/modules/card/card.schema"
import { createCardProps } from "@/modules/card/card.types"



export function CreateCardForm({ onCancel, onCreate, listId }: createCardProps) {

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const values =
        {
            title: formData.get("title"),
            description: formData.get("description"),
            listId: listId
        }

        const parsed = createCardSchema.safeParse(values)

        if (!parsed.success) {
            console.log(parsed.error)
            return
        }

        try {
            const list = await createCard(parsed.data)
            onCreate(list)
            onCancel()
        }
        catch (err) {
            //setError(extractApiErrorMessage(err))
        }

    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col bg-white rounded-xl p-4 shadow-sm gap-4 hover:shadow-md transition">
            <input className="border border-gray-200 font-semibold text-sm text-gray-900 text-center rounded-2xl" name="title" type="text" placeholder="Title" />
            <textarea className="border border-gray-200 text-sm text-gray-600 bg-gray-50 rounded-lg p-3" name="description" placeholder="Description" />
            <div className="grid grid-cols-2">
                <button type="button" onClick={onCancel} className="text-red-500 hover:text-red-800" >Cancel</button>
                <button type="submit" className="text-green-500 hover:text-green-800">Add</button>
            </div>
        </form>

    )
}