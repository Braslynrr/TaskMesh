import { createTaskboard } from "@/modules/taskboard/taskboard.api"
import { createTaskboardSchema } from "@/modules/taskboard/taskboard.schemas"
import { CreateTaskboardProps } from "@/modules/taskboard/taskboard.types"

export function CreateTaskboard( {onCreated} : CreateTaskboardProps){

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

         const formData = new FormData(e.currentTarget)
            const values = {
              name: formData.get("name"),
            }
        
            const parsed = createTaskboardSchema.safeParse(values)
        
            if (!parsed.success) {
              //setError("Invalid credentials")
              return
            }
        
            try {
              const newTaskboard = await createTaskboard(parsed.data)
              onCreated(newTaskboard)
              e.currentTarget.reset()
            }
            catch(err) {
              //setError(extractApiErrorMessage(err))
            }
    }


  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-950/5">
        <div className="h-max w-full rounded px-3 py-2 text-black">
            <h6 className="font-bold antialiased md:text-lg lg:text-xl">
                Create Taskboard
            </h6>
            <hr/>
            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    type="text"
                    placeholder="Taskboard name"
                    className="w-full rounded border px-3 py-2" required/>

                <button type="submit" className="inline-flex rounded-md border border-slate-800 bg-slate-800 px-4 py-2 text-center font-sans text-sm font-medium text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none">
                    Create
                </button>
            </form>
        </div>
    </div>
  )
}
