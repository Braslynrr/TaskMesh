import { ForbiddenError } from "../../core/errors/errors"


export function assertUserIsMember(taskboard, userId: string) {
  const isMember =
    taskboard.ownerId.toString() === userId ||
    taskboard.members.some(m => m.toString() === userId)

  if (!isMember) {
    throw new ForbiddenError("User is not a member of this taskboard")
  }
}

export function assertUserIsOwner(taskboard, userId: string) {
  if (taskboard.ownerId.toString() !== userId) {
    throw new ForbiddenError("Only owner can perform this action")
  }
}