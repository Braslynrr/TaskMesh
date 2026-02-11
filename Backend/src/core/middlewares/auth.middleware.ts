import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../errors/errors"
import { getConfig } from "../../core/config/config"

export function authMiddleware(req, _res, next) {
  
  const token = req.cookies?.auth_token

  if (!token) {
    throw new UnauthorizedError("Missing token")
  }

  try {
    const config = getConfig()

    const secret = config.jwt.secret.value
    const payload = jwt.verify(token, secret) as { _id:string }
    
    req.user =  { _id: payload._id}

    next()
  } catch (e) {
    
    throw new UnauthorizedError("Invalid or expired token")
  }
}