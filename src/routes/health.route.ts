import { Router } from 'express'
import { healthCheck } from '../controllers/health.cotroller'

const router = Router()

router.route("/health").get(healthCheck)

export default router