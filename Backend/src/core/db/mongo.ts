import mongoose from "mongoose"
import { getConfig } from "../config/config"
import { getLogger } from "../logger/logger"

export async function connectMongo(uri: string = undefined) {

  const config = getConfig()

  const mongouri = uri ?? config.db.url
  const logger = getLogger()

  if (!mongouri) {
    throw new Error("MONGO_URI is not defined")
  }

  try {

    await mongoose.connect(mongouri)
    logger.info("MongoDB connected")

  } catch (error) {

    logger.error({ err: error }, "MongoDB connection failed")
    process.exit(1)

  }
}