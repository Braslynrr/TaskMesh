import { ForbiddenError } from "../../core/errors/errors"


export function assertUserIsMember({taskboard, userId}) {
  const isMember =
    taskboard.ownerId.toString() === userId ||
    taskboard.members.some(m => m.toString() === userId)

  if (!isMember) {
    throw new ForbiddenError("user is not a member of this taskboard")
  }
}

export function assertUserIsOwner({taskboard, userId}) {
  if (taskboard.ownerId.toString() !== userId) {
    throw new ForbiddenError("only owner can perform this action")
  }
}