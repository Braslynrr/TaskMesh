import { Request, Response } from "express"
import { userService } from "./user.service"
import { createUserSchema, loginUserSchema } from "./user.schema"
import { getConfig } from "../../core/config/config"

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
  const config = getConfig()

  const scheme =  loginUserSchema.parse(req.body)
  const {refreshToken ,token, user} = await userService.login(scheme)

  res.cookie("auth_token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: config.env === "production"})

  res.cookie("refresh_token", refreshToken , {
  httpOnly: true,
  sameSite: "lax",
  path: "api/user/refresh",
  secure: config.env === "production"})

  res.status(200).json(user)
}

export async function refreshUser(req:Request, res:Response) {
  const config = getConfig()

  const refreshToken = req.cookies?.refresh_token
  if (!refreshToken) return res.sendStatus(401);

  const token= await userService.refreshUser(refreshToken)

  res.cookie("auth_token", token, {
  httpOnly: true,
  sameSite: "lax",
  secure: config.env === "production"})

  res.sendStatus(201)
}