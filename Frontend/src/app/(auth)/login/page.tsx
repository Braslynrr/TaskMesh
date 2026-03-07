import LoginClient from "@/components/login/loginClient"
import { use } from "react"


export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const param = use(searchParams)
  return <LoginClient state={param.state} />
}