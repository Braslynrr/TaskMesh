import { Types } from "mongoose"

declare global {
  namespace Express {
    interface User {
      _id: string
    }

    interface Request {
      user?: User
    }
  }
}

export {}