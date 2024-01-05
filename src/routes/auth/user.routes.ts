import { Router } from 'express'
import { changeProfile, loginUser, logoutUser, profileUpdateUrl, refreshToken, registerUser, userData } from '../../controllers/auth/user.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.route("/register").post(registerUser)


router.route("/login").post(loginUser)

router.route("/refresh").post(refreshToken)

// SECURE ROUTES
router.route("/info").get(authMiddleware, userData)
router.route("/profile-upload-url").post(authMiddleware, profileUpdateUrl);
router.route("/change-profile").get(authMiddleware, changeProfile);
router.route("/logout").post(authMiddleware, logoutUser)

export default router