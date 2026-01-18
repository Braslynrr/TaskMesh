import { Types } from "mongoose"

declare global {
  namespace Express {
    interface User {
      _id: string
      username: string
    }

    interface Request {
      user?: User
    }
  }
}

export {}