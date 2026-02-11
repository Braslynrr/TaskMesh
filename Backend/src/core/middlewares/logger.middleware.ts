import pinoHttp from "pino-http"
import { getLogger } from "../logger/logger"

const logger = getLogger()

export const httpLogger = pinoHttp({
  logger,
  
})