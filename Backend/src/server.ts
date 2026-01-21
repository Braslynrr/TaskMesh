import "dotenv/config"
import app from "./app"
import { connectMongo } from "./core/db/mongo"


const port = 5000;

async function start() {
  await connectMongo()

  try{
    app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
    })
  }catch (error){
    console.log(`Unexpect error: ${error}`)
  }
}

start()