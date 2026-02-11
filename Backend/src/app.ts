import "express-async-errors"
import cookieParser from "cookie-parser"
import { getConfig } from "./core/config/config"
import express from "express"
import cors from "cors"
import userRoutes from "./modules/Users/user.routes"
import taskboardRoutes from "./modules/Taskboard/taskboard.routes"
import listRoutes from "./modules/List/list.routes"
import cardRoutes from "./modules/Card/card.routes"
import commentRoutes from "./modules/Comment/comment.routes"
import { errorHandler } from "./core/middlewares/error-handler"
import { httpLogger } from "./core/middlewares/logger.middleware"

const config = getConfig()
const app = express();

app.use(
  cors({
    origin: config.app.origin,
    credentials: true,
  })
)

// Global middleware
app.use(cookieParser())
app.use(express.json())
app.use(httpLogger)

// Health check / root
app.get("/", (_req, res) => {
  res.send("API running")
})

// Mount modules
app.use("/api/user", userRoutes)
app.use("/api/taskboard", taskboardRoutes)
app.use("/api/list", listRoutes)
app.use("/api/card", cardRoutes)
app.use("/api/comment", commentRoutes)

app.use(errorHandler)



export default app