import { ForbiddenError } from "../../core/errors/errors";


export function assertUserCanHandleCards({
  card,
  taskboard,
  userId}
) {
  const isCardOwner = card.createdBy.toString() === userId
  const isTaskboardOwner = taskboard.ownerId.toString() === userId
  const isUserAssigned = card.assignedTo.some(a=>a.toString()===userId)

  if (!isCardOwner && !isTaskboardOwner && !isUserAssigned) {
    throw new ForbiddenError("user cannot perform this action")
  }
}


export function assertUserCanDeleteCards({
  card,
  taskboard,
  userId}
) {
  const isCardOwner = card.createdBy.toString() === userId
  const isTaskboardOwner = taskboard.ownerId.toString() === userId

  if (!isCardOwner && !isTaskboardOwner) {
    throw new ForbiddenError("user cannot perform this action")
  }
}