import { _resetConfig } from "./src/core/config/config"
import { getLogger } from "./src/core/logger/logger"
import { connectTestDB, disconnectTestDB, clearTestDB } from "./src/tests/setup/mongo"

beforeAll(async () => {
  await connectTestDB()
  getLogger().level = "silent"
})

afterEach(async () => {
  await clearTestDB()
  _resetConfig()
})

afterAll(async () => {
  await disconnectTestDB()
})