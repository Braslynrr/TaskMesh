import { ForbiddenError } from "../../core/errors/errors"


export function assertUserCanCreateComments({
  card,
  taskboard,
  userId}
) {
  const isCardOwner = card.createdBy.toString() === userId
  const isTaskboardOwner = taskboard.ownerId.toString() === userId
  const isCardAssigned = card.assignedTo.map(id => id.toString()).includes(userId)

  if (!isCardOwner && !isTaskboardOwner && !isCardAssigned) {
    throw new ForbiddenError("user cannot perform this action")
  }
}

export function assertUserCanModifyComments({
  comment,
  card,
  taskboard,
  userId}
) {
  const isCardOwner = card.createdBy.toString() === userId
  const isTaskboardOwner = taskboard.ownerId.toString() === userId
  const isCommentAuthor = comment.authorId.toString() === userId

  if (!isCardOwner && !isTaskboardOwner && !isCommentAuthor) {
    throw new ForbiddenError("user cannot perform this action")
  }
}
