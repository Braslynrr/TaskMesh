"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerSchema } from "@/modules/auth/auth.schemas"
import { extractApiErrorMessage } from "@/lib/api-error"
import { register } from "@/modules/auth/auth.api"



export default function RegisterPage(){
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
    
        const formData = new FormData(e.currentTarget)
        const values = {
          username: formData.get("username"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        }
    
        const parsed = registerSchema.safeParse(values)
    
        if (!parsed.success) {
          setError(extractApiErrorMessage(parsed.error))
          return
        }
    
        try {

          const status = await register(parsed.data)
          router.push("/login")
        
        }
        catch(err) {
          setError(extractApiErrorMessage(err))
        }
           
    }

    return <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded border p-6"
        >
          <h1 className="text-xl font-semibold">Sign up</h1>

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
          
        <input
            name="confirmPassword"
            type="password"
            placeholder="confirm your Password"
            className="w-full rounded border px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-white px-3 py-2 text-black"
          >
            sign up
          </button>
        </form>

        <div className="text-center text-sm">
          <hr className="my-3" />
          <span className="mr-1">Already have an user?</span>
          <Link href="/login" className="font-medium underline">
            sign in
          </Link>
        </div>
      </div>
    </div>
}