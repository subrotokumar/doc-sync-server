import { Router } from "express";
import { updateDocumentTitle, getDocumentById, deleteDocumentById } from "../../controllers/document/docs.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


const router = Router()

router.route("/title").post(authMiddleware, updateDocumentTitle)
router.route("/:id").get(authMiddleware, getDocumentById)
router.route("/:id").delete(authMiddleware, deleteDocumentById)

export default router