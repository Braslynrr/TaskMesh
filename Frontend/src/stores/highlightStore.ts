import { create } from "zustand"


type Highlight = {
    id: string
    activity: string
    authorId: string
}

type Store = {
    highlights: Record<string, Highlight>
    triggerHighlight: (id: string, activity: string, authorId: string) => void
}

export const useHighlightStore = create<Store>((set) => ({
    highlights: {},

    triggerHighlight: (id, activity, authorId) => {
        set((state) => ({
            highlights: {
                ...state.highlights,
                [id]: { id, activity, authorId }
            }
        }))

        setTimeout(() => {
            set((state) => {
                const copy = { ...state.highlights }
                delete copy[id]
                return { highlights: copy }
            })
        }, 3000)
    }
}))