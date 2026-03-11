import { extractApiErrorMessage } from "@/lib/api-error";
import { updateCard } from "@/modules/card/card.api";
import { updateCardSchema } from "@/modules/card/card.schema";
import { cardEditProps } from "@/modules/card/card.types";
import { useState } from "react";
import { Message } from "../message/message";


export function EditCard({ card, cancel, onUpdate }: cardEditProps) {
    const [error, setError] = useState("")
    const [disabled, setDisabled] = useState(false)


    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            setDisabled(true)
            const formData = new FormData(e.currentTarget)

            const values = {
                _id: card._id,
                title: formData.get("title"),
                description: formData.get("description"),
            }

            const data = updateCardSchema.parse(values)

            const res = await updateCard(data)

            onUpdate(res)

            cancel()

        } catch (err) {
            setError(extractApiErrorMessage(err))
        }
        setDisabled(false)

    }

    return (
        <form
            onSubmit={handleSubmit}
            className="group/card flex flex-col bg-white rounded-xl p-4 shadow-sm gap-4 hover:shadow-md transition">
            {error && <Message type="error" message={error} onClose={() => setError("")} />}

            <input name="title" defaultValue={card.title} className="border border-gray-200 font-semibold text-sm text-gray-900 text-center rounded-2xl" required />

            <textarea
                name="description"
                defaultValue={card.description}
                className="border border-gray-200 text-sm text-gray-600 bg-gray-50 rounded-lg p-3"
                required
            />
            <div className="grid grid-cols-2">
                <button type="button" onClick={cancel} className="text-red-500 hover:text-red-800">Cancel</button>
                <button type="submit" className="text-green-500 hover:text-green-800" disabled={disabled}>Save</button>
            </div>

        </form>
    )
}