import { SignOptions } from "jsonwebtoken";
import { getEnv } from "./env";

export function createConfig(env: ReturnType<typeof getEnv>) {
  return {
    env: env.NODE_ENV,

    jwt: {
      secret: {
        value: env.JWT_SECRET,
        expiresIn: env.AUTH_TIME as SignOptions["expiresIn"],
      },
      refreshSecret: {
        value: env.JWT_REFRESH,
        expiresIn: env.REFRESH_TIME as SignOptions["expiresIn"],
      },
    },

    db: {
      url: env.MONGO_URI,
    },

    app: {
      origin: env.CORS_ALLOW_LIST,
      port: env.PORT,
    },
  } as const
}

export type AppConfig = ReturnType<typeof createConfig>