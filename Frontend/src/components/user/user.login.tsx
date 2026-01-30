"use client"

import { UserResponse } from "@/modules/taskboard/taskboard.types"
import { useEffect, useState } from "react"

export function UserLoggedIn() {
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    const data = localStorage.getItem("user")
    if (data) setUser(JSON.parse(data))
  }, [])

  if (!user) return null

  return <div className="justify-self-end">
    <span className="border border-gray-200 px-3 rounded-2xl hover:border-gray-500 ">{user.username}</span>
  </div>
}