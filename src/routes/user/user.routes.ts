import { Router } from 'express'
import { loginUser, logoutUser, refreshToken, registerUser, userData } from '../../controllers/user/user.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

/**
 * @openapi
 * '/auth/register':
 * post:
 *  tags:
 *    - User
 *  summary: Register a new user
 * 
 */
router.route("/register").post(registerUser)


router.route("/login").post(loginUser)

router.route("/refresh").post(refreshToken)

// SECURE ROUTES
router.route("/info").get(authMiddleware, userData)
router.route("/logout").post(authMiddleware, logoutUser)

export default router