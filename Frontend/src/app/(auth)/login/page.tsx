import LoginClient from "@/components/login/loginClient"
import { use } from "react"


export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>
}) {
  const param = use(searchParams)
  return <LoginClient expired={param.expired} />
}