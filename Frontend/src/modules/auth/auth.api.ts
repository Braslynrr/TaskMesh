import { apiClient } from "@/lib/api-client"
import { LoginRequest, LoginResponse, PassowrdResetRequest, RegisterRequest } from "./auth.types"

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post("/user/login", data)
  return res.data
}


export async function register(data:RegisterRequest) {
  const res = await apiClient.post("/user/register", data)
  return res.data
}


export async function passwordReset(data:PassowrdResetRequest) {
  const res = await apiClient.post("/user/password", data)
  return res.data
}