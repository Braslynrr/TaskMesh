import { HttpError } from "./http-error"

export class ValidationError extends HttpError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(message, 404)
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409)
  }
}
