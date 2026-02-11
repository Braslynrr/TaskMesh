import { envSchema } from "./env.shema"


let _env: ReturnType<typeof envSchema.parse> | null = null

export function getEnv() {
  if (!_env) {
    const parsed = envSchema.safeParse(process.env)

    if (!parsed.success) {
      console.error("Invalid environment variables:")
      for (const issue of parsed.error.issues) {
        console.error({ err: ` - ${issue.path.join(".")}: ${issue.message}` }, "Something failed")
      }
      process.exit(1)
    }

    _env = parsed.data
  }

  return _env
}