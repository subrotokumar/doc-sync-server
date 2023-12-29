import { Router } from "express";
import { updateDocumentTitle, getDocumentById } from "../../controllers/docs/docs.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


const router = Router()

router.route("/title").post(authMiddleware, updateDocumentTitle)
router.route("/:id").get(authMiddleware, getDocumentById)

export default router