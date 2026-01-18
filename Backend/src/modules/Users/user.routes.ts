import { Router } from "express"
import { registerUser, resetPassoword, login } from "./user.controller"
import { authMiddleware } from "../../core/middlewares/auth.middleware"

const router = Router()


router.post("/register", registerUser)
router.post("/password", resetPassoword)
router.post("/login", login)

router.post("/logout", authMiddleware, (_req, res) => {
  res.sendStatus(204)
})

export default router
