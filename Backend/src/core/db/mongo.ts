import mongoose from "mongoose"

export async function connectMongo(uri:string = undefined) {

  const mongouri = uri ?? process.env.MONGO_URI

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