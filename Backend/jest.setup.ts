import { connectTestDB, disconnectTestDB, clearTestDB } from "./src/tests/setup/mongo"

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret"
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await disconnectTestDB()
})

console.log("🧪 Jest setup loaded")