import { ZodError } from "zod"
import { HttpError } from "../errors/http-error"
import { issue } from "zod/v4/core/util.cjs"

export function errorHandler(err, req, res, next) {
  // 1️⃣ Zod validation errors FIRST
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      issues: err.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    })
  }

  // 2️⃣ Domain / HTTP errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error:  err.constructor.name, 
      issues: [{
        path: err.stack.toString(),
        message : err.message
      }]
    })
  }

  // 3️⃣ Unknown errors
  console.error(err)

  return res.status(500).json({
    error: "Internal server error"
  })
}