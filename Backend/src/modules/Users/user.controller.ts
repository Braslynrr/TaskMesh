import { Request, Response } from "express"
import { userService } from "./user.service"
import { createUserSchema, loginUserSchema } from "./user.schema"

export async function registerUser(req: Request, res: Response) {
  const result = createUserSchema.parse(req.body)
  await userService.register(result)
  res.status(201).send()
}

export async function resetPassoword(req:Request, res:Response) {
  const result =  createUserSchema.parse(req.body)
  await userService.resetPassword(result)
  res.status(200).send()
}

export async function login(req:Request, res:Response) {
  const scheme =  loginUserSchema.parse(req.body)
  const {token, user} = await userService.login(scheme)

  res.cookie("auth_token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"})

  res.status(200).json(user)
}