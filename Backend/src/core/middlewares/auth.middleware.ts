import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../errors/errors"

export function authMiddleware(req, _res, next) {
  
  const token = req.cookies?.auth_token

  if (!token) {
    throw new UnauthorizedError("Missing token")
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {_id: string,username: string}

    req.user =  { _id: payload._id, username: payload.username}

    next()
  } catch {
    throw new UnauthorizedError("Invalid or expired token")
  }
}