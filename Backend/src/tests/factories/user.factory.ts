import { userRepository } from "../../modules/Users/user.repository"
import jwt from "jsonwebtoken"

export async function createUser(username:string="test") {
  return userRepository.create({
    username: username,
    password: "hashed-password",
  })
}


export async function createAuthUser(username:string="test") {
  const user = await createUser(username)
  const token = jwt.sign(
    {
      _id: user._id.toString(),
      username: user.username
    },
    process.env.JWT_SECRET!,
    {expiresIn: '1h'}
  )
  return { token, user:{ _id:user._id.toString() , username:user.username} }
}