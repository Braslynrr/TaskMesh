import { useEffect } from "react"
import { listResponse } from "@/modules/list/list.types"
import { cardResponse } from "@/modules/card/card.types"
import { socket } from "./socket-client"
import { SocketEvents } from "@/socket-lib/socket.events"
import { cardDeletedPayload, cardMovedPayload, cardUpsertPayload, commentDupsertPayload, listDeletedPayload, listMovedPayload, listUpsertPayload, taskboardMembersPayload } from "@/socket-lib/socket.types"
import { arrayMove } from "@dnd-kit/sortable"
import { useTaskboardStore } from "@/stores/taskboardStore"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { useHighlightStore } from "@/stores/highlightStore"
import { useActivityStore } from "@/stores/activityStore"

interface UseBoardSocketProps {
  taskboardId: string
  setLists: React.Dispatch<React.SetStateAction<listResponse[]>>
  setCards: React.Dispatch<React.SetStateAction<cardResponse[]>>
  moveCards: (array: any[], from: number, to: number) => void
}

export function useBoardSocket({
  taskboardId,
  setLists,
  setCards
}: UseBoardSocketProps) {

  const setTaskboard = useTaskboardStore(s => s.setTaskboard)
  const triggerHighlight = useHighlightStore(s => s.triggerHighlight)
  const addActivity = useActivityStore(s => s.AddActivity)

  useEffect(() => {
    if (!taskboardId) return

    if (!socket.connected) {
      socket.connect()
    }

    socket.emit(SocketEvents.JOIN_TASKBOARD, taskboardId)

    // Lists
    const handleListCreated = (payload: listUpsertPayload) => {
      setLists(prev => [...prev, payload.list])
      triggerHighlight(payload.list._id, `created this list`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` created '${payload.list.title}' list` })
    }

    const handleListUpdated = (payload: listUpsertPayload) => {
      setLists(prev => prev.map(l =>
        l._id === payload.list._id ? payload.list : l
      ))

      triggerHighlight(payload.list._id, `updated this list`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` updated '${payload.list.title}' list` })
    }

    const handleListDeleted = (payload: listDeletedPayload) => {

      setLists(prev => prev.filter(l => l._id !== payload.listId))

      addActivity({
        author: payload.authorId,
        action: ` deleted '"${payload.title}"' list`
      })
    }

    const handleListMoved = (payload: listMovedPayload) => {
      setLists((prev) => arrayMove(prev, payload.from - 1, payload.to - 1))

      triggerHighlight(payload.listId, `moved this list`, payload.authorId)

      addActivity({
        author: payload.authorId,
        action: ` moved '${payload.title}' list`
      })
    }


    // Cards

    const handleCardCreated = (payload: cardUpsertPayload) => {
      setCards((prev) => [...prev, payload.card])
      triggerHighlight(payload.card._id, `created this card`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` created '${payload.card.title}' card` })
    }

    const handleCardUpdated = (payload: cardUpsertPayload) => {
      setCards(prev => prev.map(c =>
        c._id === payload.card._id ? payload.card : c
      ))

      triggerHighlight(payload.card._id, `updated this card`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` updated '${payload.card.title}' card` })
    }

    const handleCardDeleted = (payload: cardDeletedPayload) => {
      setCards(prev => prev.filter(c => c._id !== payload.cardId))
      addActivity({ author: payload.authorId, action: ` updated '${payload.title}' card` })
    }

    const handleCardMoved = (payload: cardMovedPayload) => {
      setCards((prev) => {
        const card = prev.find(c => c._id === payload.cardId)
        if (card) {
          const newCard: cardResponse = { ...card, listId: payload.to }
          return prev.map(c => c._id === card._id ? newCard : c)
        }
        return prev
      })

      triggerHighlight(payload.cardId, `moved this card`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` moved '${payload.title}' card` })
    }

    // comments

    const handleCommentCreated = (payload: commentDupsertPayload) => {
      setCards((prev) => {
        const card = prev.find(c => c._id === payload.cardId)
        if (card) {
          const newCard: cardResponse = { ...card, comments: card.comments + 1 }
          return prev.map(c => c._id === card._id ? newCard : c)
        }
        return prev
      })

      triggerHighlight(payload.cardId, `commented this task`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` commented in '${payload.title}' card` })
    }

    const handleCommentUpdated = (payload: commentDupsertPayload) => {
      setCards((prev) => {
        const card = prev.find(c => c._id === payload.cardId)
        if (card) {
          const newCard: cardResponse = { ...card, comments: card.comments }
          return prev.map(c => c._id === card._id ? newCard : c)
        }
        return prev
      })

      triggerHighlight(payload.cardId, `updated a comment`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` updated a comment in '${payload.title}' card` })
    }

    const handleCommentDeleted = (payload: commentDupsertPayload) => {
      setCards((prev) => {
        const card = prev.find(c => c._id === payload.cardId)
        if (card) {
          const newCard: cardResponse = { ...card, comments: card.comments - 1 }
          return prev.map(c => c._id === card._id ? newCard : c)
        }
        return prev
      })

      triggerHighlight(payload.cardId, `deleted a comment`, payload.authorId)
      addActivity({ author: payload.authorId, action: ` deleted a comment in '${payload.title}' card` })
    }

    const handleTaskboardMembers = (payload: taskboardMembersPayload) => {
      const newTaskboard: TaskboardResponse = { ...payload.taskboard, members: [payload.taskboard.owner, ...payload.taskboard.members] }
      setTaskboard(newTaskboard)
    }

    socket.on(SocketEvents.LIST_CREATED, handleListCreated)
    socket.on(SocketEvents.LIST_UPDATED, handleListUpdated)
    socket.on(SocketEvents.LIST_DELETED, handleListDeleted)
    socket.on(SocketEvents.LIST_MOVED, handleListMoved)


    socket.on(SocketEvents.CARD_CREATED, handleCardCreated)
    socket.on(SocketEvents.CARD_UPDATED, handleCardUpdated)
    socket.on(SocketEvents.CARD_DELETED, handleCardDeleted)
    socket.on(SocketEvents.CARD_MOVED, handleCardMoved)


    socket.on(SocketEvents.COMMENT_CREATED, handleCommentCreated)
    socket.on(SocketEvents.COMMENT_UPDATED, handleCommentUpdated)
    socket.on(SocketEvents.COMMENT_DELETED, handleCommentDeleted)

    socket.on(SocketEvents.TASKBOARD_MEMBERS, handleTaskboardMembers)

    return () => {
      socket.off(SocketEvents.LIST_CREATED, handleListCreated)
      socket.off(SocketEvents.LIST_UPDATED, handleListUpdated)
      socket.off(SocketEvents.LIST_DELETED, handleListDeleted)
      socket.off(SocketEvents.LIST_MOVED, handleListMoved)

      socket.off(SocketEvents.CARD_CREATED, handleCardCreated)
      socket.off(SocketEvents.CARD_UPDATED, handleCardUpdated)
      socket.off(SocketEvents.CARD_DELETED, handleCardDeleted)
      socket.off(SocketEvents.CARD_MOVED, handleCardMoved)

      socket.off(SocketEvents.COMMENT_CREATED, handleCommentCreated)
      socket.off(SocketEvents.COMMENT_UPDATED, handleCommentUpdated)
      socket.off(SocketEvents.COMMENT_DELETED, handleCommentDeleted)

      socket.off(SocketEvents.TASKBOARD_MEMBERS, handleTaskboardMembers)


      socket.emit(SocketEvents.LEAVE_TASKBOARD, taskboardId)
      socket.disconnect()
    }

  }, [taskboardId])
}