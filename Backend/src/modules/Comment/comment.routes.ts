import { Router } from "express"
import { authMiddleware } from "../../core/middlewares/auth.middleware"
import { createComment, deleteComment, getComments, updateComment } from "./comment.controller"

const router = Router()

router.post("/", authMiddleware, createComment)
router.get("/", authMiddleware, getComments)
router.delete("/", authMiddleware, deleteComment)
router.patch("/", authMiddleware, updateComment)

export default router
