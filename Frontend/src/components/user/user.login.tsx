"use client"

import { UserResponse } from "@/modules/auth/auth.types"
import { useEffect, useState } from "react"
import UserAvatar from "./user.avatar"

export function UserLoggedIn() {
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    const data = localStorage.getItem("user")
    if (data) setUser(JSON.parse(data))
  }, [])

  if (!user) return null

  return <div className="justify-self-end">
    <UserAvatar user={user} />
  </div>
}