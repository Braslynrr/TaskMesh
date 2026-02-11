import "dotenv/config"
import { getConfig } from "./core/config/config"
import app from "./app"
import { connectMongo } from "./core/db/mongo"
import { getLogger } from "./core/logger/logger"

async function start() {


  const config = getConfig()
  
  const logger = getLogger()
  try {

    await connectMongo()

    const port = config.app.port

    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${config.app.port}`)
    })

  } catch (error) {

    logger.fatal({ err: error }, `Unexpect error`)
  }
}

start()