import express from 'express'
import {generateSchema} from './validation/schemas/generate'
import {generate} from './api/generate'
import {validate} from './middleware/validate'

const router = express.Router()

router.post('/generate', validate(generateSchema), generate)

export default router
