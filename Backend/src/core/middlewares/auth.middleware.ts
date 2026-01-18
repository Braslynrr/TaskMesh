import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../errors/errors"

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing token")
  }

  const token = header.split(" ")[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = payload   // attach user info
    next()
  } catch {
    throw new UnauthorizedError("Invalid or expired token")
  }
}