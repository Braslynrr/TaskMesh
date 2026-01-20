import { ForbiddenError } from "../../core/errors/errors";


export function assertUserCanHandleCards({
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
