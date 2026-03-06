import { serializeUser } from "../../modules/Users/user.serializer"
import { userRepository } from "../../modules/Users/user.repository"
import { userService } from "../../modules/Users/user.service"

export async function createUser(username: string = "test") {
  const user = await userRepository.create({
    username: username,
    password: "hashed-password",
  })
  return serializeUser(user)
}


export async function createAuthUser(username: string = "test") {
  const userdoc = await createUser(username)
  const user = { _id: userdoc._id.toString(), username: userdoc.username }
  const token = await userService.createAuthToken(user)
  return { token, user: user }
}