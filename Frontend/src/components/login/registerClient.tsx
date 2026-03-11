"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerSchema } from "@/modules/auth/auth.schemas"
import { extractApiErrorMessage } from "@/lib/api-error"
import { register } from "@/modules/auth/auth.api"
import { SpinnerCircular } from "spinners-react"
import { Message } from "../message/message"


export default function RegisterClient() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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
        setLoading(true)
        try {

            const status = await register(parsed.data)
            router.push("/login?state=1")

        }
        catch (err) {
            setError(extractApiErrorMessage(err))
        }
        setLoading(false)

    }

    return <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded border p-6"
            >
                <h1 className="text-xl font-semibold">Sign up</h1>

                {error && <Message type="error" message={error} onClose={() => setError("")} />}

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
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded bg-gray-200 px-3 py-2 text-black hover:bg-white disabled:opacity-50"
                >
                    <span>{loading ? "Singing up..." : "Sign up"}</span>
                    {loading && <SpinnerCircular size={25} />}
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