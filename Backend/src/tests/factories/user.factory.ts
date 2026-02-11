import { userRepository } from "../../modules/Users/user.repository"
import { userService } from "../../modules/Users/user.service"


export async function createUser(username:string="test") {
  return userRepository.create({
    username: username,
    password: "hashed-password",
  })
}


export async function createAuthUser(username:string="test") {
  const userdoc = await createUser(username)
  const user = { _id:userdoc._id.toString() , username:userdoc.username }
  const token = await userService.createAuthToken(user)
  return { token, user: user}
}