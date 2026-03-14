import { cardResponse } from "@/modules/card/card.types"
import { listResponse } from "@/modules/list/list.types"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"


export interface ServerToClientEvents {

    JOINED_TASKBOARD: (payload: taskboardPayload) => void

    TASKBOARD_MEMBERS: (payload: taskboardMembersPayload) => void,

    LIST_CREATED: (payload: listUpsertPayload) => void

    LIST_UPDATED: (payload: listUpsertPayload) => void

    LIST_DELETED: (payload: listDeletedPayload) => void

    LIST_MOVED: (payload: listMovedPayload) => void

    CARD_CREATED: (payload: cardUpsertPayload) => void

    CARD_UPDATED: (payload: cardUpsertPayload) => void

    CARD_DELETED: (payload: cardDeletedPayload) => void

    CARD_MOVED: (payload: cardMovedPayload) => void

    COMMENT_UPDATED: (payload: commentDupsertPayload) => void

    COMMENT_DELETED: (payload: commentDupsertPayload) => void

    COMMENT_CREATED: (payload: commentDupsertPayload) => void

    LEAVE_TASKBOARD: (taskboardId: string) => void

}

export interface ClientToServerEvents {
    JOIN_TASKBOARD: (taskboardId: string) => void
    LEAVE_TASKBOARD: (taskboardId: string) => void
}

type basePayload = {
    authorId: string
}


type basetitledPayload = basePayload & {
    title: string
}


export type taskboardPayload = {
    taskboardId: string
}

export type taskboardMembersPayload = basePayload & {
    taskboard: TaskboardResponse
}

export type listUpsertPayload = basePayload & {
    list: listResponse
}

export type listDeletedPayload = basetitledPayload & {
    listId: string
}

export type listMovedPayload = basetitledPayload & {
    listId: string
    from: number
    to: number
}

export type cardUpsertPayload = basePayload & {
    card: cardResponse
}

export type cardMovedPayload = basetitledPayload & {
    cardId: string
    to: string
}

export type cardDeletedPayload = basetitledPayload & {
    cardId: string
}

export type commentDupsertPayload = basetitledPayload & {
    cardId: string
}