import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { create } from "zustand"


type TaskboardStore = {
    taskboard: TaskboardResponse | undefined
    setTaskboard: (members: TaskboardResponse) => void
}

export const useTaskboardStore = create<TaskboardStore>((set) => ({
    taskboard: undefined,

    setTaskboard: (taskboard) => set({ taskboard }),

}))