import "dotenv/config"
import app from "./app"
import { connectMongo } from "./core/db/mongo"


const port = 3000;

async function start() {
  await connectMongo()

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
  })
}

start()