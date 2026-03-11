import { create } from "zustand"

type Highlight = {
  id: string
  activity: string
  authorId: string
}

type Store = {
  highlights: Record<string, Highlight>
  timers: Record<string, NodeJS.Timeout>
  triggerHighlight: (id: string, activity: string, authorId: string) => void
}

export const useHighlightStore = create<Store>((set, get) => ({
  highlights: {},
  timers: {},

  triggerHighlight: (id, activity, authorId) => {

    const { timers } = get()

    // Cancel previous timer if exists
    if (timers[id]) {
      clearTimeout(timers[id])
    }

    const timeout = setTimeout(() => {
      set((state) => {
        const highlights = { ...state.highlights }
        const timers = { ...state.timers }

        delete highlights[id]
        delete timers[id]

        return { highlights, timers }
      })
    }, 3000)

    set((state) => ({
      highlights: {
        ...state.highlights,
        [id]: { id, activity, authorId }
      },
      timers: {
        ...state.timers,
        [id]: timeout
      }
    }))
  }
}))