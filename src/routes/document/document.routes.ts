import { Router } from "express";
import { createDocument, getDocumentList } from "../../controllers/document/document.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


const router = Router()

router.route("/create").get(authMiddleware, createDocument)
router.route("/me").get(authMiddleware, getDocumentList)

export default router