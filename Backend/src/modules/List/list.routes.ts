import { Router } from "express"
import { authMiddleware } from "../../core/middlewares/auth.middleware"
import { createList, deleteList, getLists, moveList } from "./list.controller"

const router = Router()

router.post("/create", authMiddleware, createList)
router.get("/:id", authMiddleware, getLists)
router.delete("/", authMiddleware, deleteList)
router.post("/move", authMiddleware, moveList)

export default router
