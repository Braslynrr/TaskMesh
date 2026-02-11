import { apiClient } from "@/lib/api-client"
import { LoginRequest, PassowrdResetRequest, RegisterRequest, UserResponse } from "./auth.types"

export async function login(data: LoginRequest): Promise<UserResponse> {
  const res = await apiClient.post("/user/login", {...data, _retry:false})
  return res.data
}


export async function register(data:RegisterRequest) {
  const res = await apiClient.post("/user/register", {...data, _retry:false})
  return res.data
}


export async function passwordReset(data:PassowrdResetRequest) {
  const res = await apiClient.post("/user/password", {...data, _retry:false})
  return res.data
}
