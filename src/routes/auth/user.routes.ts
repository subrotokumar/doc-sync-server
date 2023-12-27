import { Router } from 'express'
import { registerUser } from '../../controllers/auth/user.comtroller'

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(registerUser)
router.route("/refresh").post(registerUser)

export default router