import { Response, Request } from "express";
import { ZodError } from "zod"
import { HttpError } from "../errors/http-error"
import { getLogger } from "../logger/logger";

export function errorHandler(err, req:Request, res:Response, next) {
  const logger = getLogger()

  // Zod validation errors FIRST
  if (err instanceof ZodError) {

    const issues = err.issues.map(issue => ({
        message: issue.message
      }))

    logger.error(`error:${issues}`)

    return res.status(400).json({
      error: "Validation failed",
      issues: issues
    })
  }


  // Domain / HTTP errors
  if (err instanceof HttpError) {

    const message = err.message

    logger.error(`${message}`)

    return res.status(err.status).json({
      error:  err.constructor.name, 
      issues: [{
        message : err.message
      }]
    })
  }

  //  Unknown errors
  logger.error(`error:${err}`)

  return res.status(500).json({
      error:  "Internal server error", 
      issues: [{
        message : err.toString()
      }]
    })
}