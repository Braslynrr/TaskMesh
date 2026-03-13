import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { create } from "zustand"

const defaultValue = "unknown"

type TaskboardStore = {
    taskboard: TaskboardResponse | undefined
    setTaskboard: (members: TaskboardResponse | undefined) => void
    getAuthorUsername: (id: string) => string
}

export const useTaskboardStore = create<TaskboardStore>((set, get) => ({
    taskboard: undefined,

    setTaskboard: (taskboard) => set({ taskboard }),

    getAuthorUsername: (id) => {
        const { taskboard } = get()

        if (!taskboard) return defaultValue

        const author = taskboard.members.find(m => m._id === id)

        return author?.username ?? defaultValue
    }

}))