import "dotenv/config"
import { getConfig } from "./core/config/config"
import app from "./app"
import { connectMongo } from "./core/db/mongo"
import { getLogger } from "./core/logger/logger"
import http from "http"
import { initSocket } from "./modules/Socket/socket.server"

async function start() {
  const config = getConfig()
  const logger = getLogger()

  try {
    await connectMongo()

    const port = config.app.port

    const server = http.createServer(app)

    initSocket(server, config.app.origin)

    server.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`)
    })

  } catch (error) {
    logger.fatal({ err: error }, `Unexpected error`)
  }
}

start()