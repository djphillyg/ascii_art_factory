import express from 'express'
import {generateSchema} from '../validation/schemas/generate.js'
import {validate} from '../middleware/validate.js'
import {generate} from './generate.js'

const router = express.Router()

router.post('/generate', validate(generateSchema), generate)

export default router
