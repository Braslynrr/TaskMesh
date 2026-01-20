import { Router } from "express"
import { authMiddleware } from "../../core/middlewares/auth.middleware"
import { assingUsersToCard, createCard, deleteCard, getCards, moveFromList, updateCard } from "./card.controller"

const router = Router()

router.post("/create", authMiddleware, createCard)
router.post("/move", authMiddleware, moveFromList)
router.post("/assign", authMiddleware, assingUsersToCard)
router.get("/", authMiddleware, getCards)
router.delete("/", authMiddleware, deleteCard)
router.patch("/", authMiddleware, updateCard )

export default router
