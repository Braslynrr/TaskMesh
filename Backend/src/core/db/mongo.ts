import mongoose from "mongoose"
import { getConfig } from "../config/config"

export async function connectMongo(uri:string = undefined) {

  const config = getConfig()
  
  const mongouri = uri ?? config.db.url

  if (!mongouri) {
    throw new Error("MONGO_URI is not defined")
  }

  try {
    await mongoose.connect(mongouri)
    console.log("MongoDB connected")

  } catch (error) {
    console.error("MongoDB connection failed", error)
    process.exit(1)
  
  }
}