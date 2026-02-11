import "dotenv/config"
import { getConfig } from "./core/config/config"
import app from "./app"
import { connectMongo } from "./core/db/mongo"

async function start() {

  try{

    await connectMongo()
    
    const config = getConfig()
    
    const port = config.app.port

    app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${config.app.port}`)
    })

  }catch (error){
    
    console.log(`Unexpect error: ${error}`)
  }
}

start()