import { createList } from "@/modules/taskboard/taskboard.api"
import { createListSchema } from "@/modules/taskboard/taskboard.schemas"
import { CreateListProps } from "@/modules/taskboard/taskboard.types"


export function CreateList({taskboardId, onCreate}:CreateListProps){

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const values = 
        {
            title: formData.get("title"),
            taskboardId: taskboardId
        }

        const parsed = createListSchema.safeParse(values)

        if (!parsed.success) {
              //setError("Invalid credentials")
              return
            }
        
            try {
              const list = await createList(parsed.data)
              onCreate(list)
            }
            catch(err) {
              //setError(extractApiErrorMessage(err))
            }

    }


    return <form onSubmit={handleSubmit} className="flex flex-col bg-white rounded-lg p-5 shadow text-black gap-2">
        <input name="title" className="border border-b-black rounded-2xl text-center" type="text" placeholder="Title"/>
        <button className=" bg-green-400 rounded-2xl" type="submit" >Create List</button>
    </form>
}