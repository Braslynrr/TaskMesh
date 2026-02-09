"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/modules/auth/auth.api"
import { loginSchema } from "@/modules/auth/auth.schemas"
import { extractApiErrorMessage } from "@/lib/api-error"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const values = {
      username: formData.get("username"),
      password: formData.get("password"),
    }

    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      setError("Invalid credentials")
      return
    }

    try {
      const user = await login(parsed.data)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/taskboard")
    }
    catch(err) {
      setError(extractApiErrorMessage(err))
    }
    
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded border p-6"
        >
          <h1 className="text-xl font-semibold">Login</h1>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full rounded border px-3 py-2"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded border px-3 py-2"
            required
          />

          <button
            type="submit"
            className="w-full rounded bg-gray-200  px-3 py-2 text-black hover:bg-white"
          >
            Log in
          </button>
        </form>

        <div className="text-center text-sm">
          <hr className="my-3" />
          <span className="mr-3">Don’t have an account?</span>
          <Link href="/register" className="font-medium underline">
            Create one
          </Link>
        </div>
        <div className="text-center text-sm">
            <span className="mr-3">
              <Link href="/password/reset" className="font-medium underline">
                forgot password?
              </Link>
        </span>
        </div>
        
      </div>
    </div>
  )
}
