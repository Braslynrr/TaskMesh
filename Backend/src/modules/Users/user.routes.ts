import { Router } from "express"
import { registerUser, resetPassoword, login, refreshUser, logout } from "./user.controller"
import { authMiddleware } from "../../core/middlewares/auth.middleware"

const router = Router()

router.post("/refresh", refreshUser)
router.post("/register", registerUser)
router.post("/password", resetPassoword)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)

export default router
