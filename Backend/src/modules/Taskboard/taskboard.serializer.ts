import { CardResponse } from "../Card/card.types";
import { listResponse } from "../List/list.types";
import { serializeUser } from "../Users/user.serializer";
import { Taskboard, TaskboardDoc, TaskBoardSnapshot } from "./taskboard.types";

export function serializeTaskboard(taskboard:TaskboardDoc): Taskboard {
    return {
        _id: taskboard._id.toString(),
        name: taskboard.name,
        members: taskboard.members.map(member => serializeUser(member)),
        owner: serializeUser(taskboard.ownerId)
    }
}

export function serializeTaskboardSnapshot(taskboard: Taskboard, lists:listResponse[], cards: CardResponse[]): TaskBoardSnapshot {
    return {
        ...taskboard,
        lists: lists,
        cards: cards
    }
}