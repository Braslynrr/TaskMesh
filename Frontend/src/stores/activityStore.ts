import { Activity } from "@/modules/general/general.types"
import { create } from "zustand"

type ActivityStore = {
    activities: Activity[]
    AddActivity: (activity: Activity) => void
    ClearActivities: () => void
}

export const useActivityStore = create<ActivityStore>((set) => ({
    activities: [],

    AddActivity: (activity) =>
        set((state) => ({
            activities: [...state.activities, activity].slice(-50),
        })),

    ClearActivities: () => set({ activities: [] })

}))