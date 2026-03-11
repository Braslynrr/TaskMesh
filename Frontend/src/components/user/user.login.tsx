"use client"

import { UserResponse } from "@/modules/auth/auth.types"
import { useEffect, useState } from "react"
import UserAvatar from "./user.avatar"
import { logout } from "@/modules/auth/auth.api"

export function UserLoggedIn({ mobile }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    const data = localStorage.getItem("user")
    if (data) setUser(JSON.parse(data))
  }, [])

  async function handleLogout() {
    const res = await logout()

    window.location.href = "/login?state=4"
  }

  return (
    !mobile?
      <div className="justify-self-end relative">
        <button onClick={() => setOpen(!open)}>
          {user && <UserAvatar user={user} />}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-24 bg-gray-800 border rounded shadow-md z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 hover:bg-gray-500"
            >
              Logout
            </button>
          </div>
        )}
      </div> 
      :
      <button
        onClick={handleLogout}
        className="block w-full text-left px-3 py-2 hover:bg-gray-500"
      >
        Logout
      </button>

  )
}