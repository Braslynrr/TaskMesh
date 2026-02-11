import { _resetConfig } from "./src/core/config/config"
import { connectTestDB, disconnectTestDB, clearTestDB } from "./src/tests/setup/mongo"

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
  _resetConfig()
})

afterAll(async () => {
  await disconnectTestDB()
})