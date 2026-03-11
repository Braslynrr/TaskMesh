"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/modules/auth/auth.api"
import { loginSchema } from "@/modules/auth/auth.schemas"
import { extractApiErrorMessage } from "@/lib/api-error"
import Link from "next/link"
import { SpinnerCircular } from "spinners-react"
import { Message } from "../message/message"

export default function LoginClient({ state }: { state?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [usingState, setUsingState] = useState(true)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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

    setLoading(true)
    try {
      const user = await login(parsed.data)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/taskboard")
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        {usingState && state === "1" && <Message type="message" message="Your user has been registered successfully." onClose={() => setUsingState(false)} />}
        {usingState && state === "2" && <Message type="error" message="Your session has expired. Please log in again." onClose={() => setUsingState(false)} />}
        {usingState && state === "3" && <Message type="message" message="Your user password has been reset." onClose={() => setUsingState(false)} />}
        {usingState && state === "4" && <Message type="message" message="Your session has been logged out." onClose={() => setUsingState(false)} />}

        <form onSubmit={handleSubmit} className="space-y-4 rounded border p-6">
          <h1 className="text-xl font-semibold">Login</h1>
          {error && <Message type="error" message={error} onClose={() => setError("")} />}
          <input name="username" type="text" placeholder="Username" className="w-full rounded border px-3 py-2" required />
          <input name="password" type="password" placeholder="Password" className="w-full rounded border px-3 py-2" required />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded bg-gray-200 px-3 py-2 text-black hover:bg-white disabled:opacity-50"
          >
            <span>{loading ? "Logging in..." : "Log in"}</span>
            {loading && <SpinnerCircular size={25} />}
          </button>
        </form>

        <div className="text-center text-sm">
          <hr className="my-3" />
          <span className="mr-3">Don’t have an account?</span>
          <Link href="/register" className="font-medium underline">Create one</Link>
        </div>

        <div className="text-center text-sm">
          <Link href="/password/reset" className="font-medium underline">
            forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}