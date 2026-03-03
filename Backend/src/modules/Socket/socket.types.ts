import { CardResponse } from "../Card/card.types"
import { listResponse } from "../List/list.types"

export interface ServerToClientEvents {

    JOINED_TASKBOARD: (payload: {
        taskboardId: string
    }) => void

    LIST_MOVED: (payload: {
        listId: string
        from: number
        to: number
    }) => void

    LIST_UPSERT: (payload: {
        list: listResponse
    }) => void

    LIST_DELETED: (payload: {
        listId: string
    }) => void

    CARD_MOVED: (payload: {
        cardId: string
        to: string
    }) => void

    CARD_UPSERT: (payload: {
        card: CardResponse
    }) => void

    CARD_DELETED: (payload: {
        cardId: string
    }) => void

    COMMENT_UPDATED: (payload: {
        cardId: string
    }
    ) => void

    COMMENT_DELETED: (payload: {
        cardId: string
    }
    ) => void

    COMMENT_CREATED: (payload: {
        cardId: string
    }
    ) => void

}

export interface ClientToServerEvents {
    JOIN_TASKBOARD: (taskboardId: string) => void
}