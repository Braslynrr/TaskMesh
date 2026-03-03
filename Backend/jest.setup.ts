import { _resetConfig } from "./src/core/config/config"
import { getLogger } from "./src/core/logger/logger"
import { initSocket } from "./src/modules/Socket/socket.server"
import { getServer } from "./src/tests/factories/server.factory"
import { connectTestDB, disconnectTestDB, clearTestDB } from "./src/tests/setup/mongo"

beforeAll(async () => {
  await connectTestDB()
  getLogger().level = "silent"
  initSocket(getServer())
})

afterEach(async () => {
  await clearTestDB()
  _resetConfig()
})

afterAll(async () => {
  await disconnectTestDB()
})