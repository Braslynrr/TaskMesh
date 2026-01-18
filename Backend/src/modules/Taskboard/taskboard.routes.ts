import { Router } from "express"
import { authMiddleware } from "../../core/middlewares/auth.middleware"
import { addMembers, createTaskboard, deleteTaskboard } from "./taskboard.controller"

const router = Router()

router.post("/create", authMiddleware, createTaskboard)
router.post("/add", authMiddleware, addMembers)
router.delete("/", authMiddleware, deleteTaskboard)


export default router
