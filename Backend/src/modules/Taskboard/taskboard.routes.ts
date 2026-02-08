import { Router } from "express"
import { authMiddleware } from "../../core/middlewares/auth.middleware"
import { addMembers, createTaskboard, deleteTaskboard, getTaskboard, getTaskboards, getTaskboardSnapshot } from "./taskboard.controller"

const router = Router()

router.get("/", authMiddleware, getTaskboards)
router.get("/:id", authMiddleware, getTaskboard)
router.get("/:id/snapshot", authMiddleware, getTaskboardSnapshot)
router.post("/create", authMiddleware, createTaskboard)
router.post("/add", authMiddleware, addMembers)
router.delete("/:id", authMiddleware, deleteTaskboard)


export default router
