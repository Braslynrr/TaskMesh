import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userRepository } from "./user.repository"
import { CreateUserDTO, LoginUserDTO } from "./user.schema"
import { ConflictError, UnauthorizedError } from "../../core/errors/errors"
import { serializeUser } from "./user.serializer"

export const userService = {
  async register(data: CreateUserDTO) {
    const exists = await userRepository.findByUsername(data.username)
    if (exists) {
      throw new ConflictError("Username is already in use")
    }

    const hashed = await bcrypt.hash(data.password, 10)

    const user = await userRepository.create({
      username: data.username,
      password: hashed
    })

    return {
      id: user.id,
      email: user.username,
      role: user.role
    }
  },

  async resetPassword(data: CreateUserDTO){
    const exists = await userRepository.findByUsername(data.username)
    if (!exists) {
      throw new UnauthorizedError("Username is not registered")
    }

    const hashed = await bcrypt.hash(data.password, 10)

    const isValid = await bcrypt.compare(data.password, exists.password)

    if (isValid) {
      throw new ConflictError("Username already has the same password")
    }

    const user = await userRepository.resetPassword({
      username: data.username,
      password: hashed
    })

    return user

  },

  async login(data: LoginUserDTO){
    const loginInfo = await userRepository.findByUsername(data.username)
    if (!loginInfo) {
      throw new UnauthorizedError("Username or password credentials are not valid")
    }

    const isValid = await bcrypt.compare(data.password, loginInfo.password)

    if (!isValid) {
      throw new UnauthorizedError("Username or password credentials are not valid")
    }

    const user = serializeUser(loginInfo)
    
    const token = jwt.sign(
    user,
    process.env.JWT_SECRET!,
    {expiresIn: '1h'})

    return { token, user }
  }
}
