import express from 'express'
import {generateSchema} from '../validation/schemas/generate.js'
import {validate} from '../middleware/validate.js'
import {generate} from './generate.js'
import {getAllShapes} from './shapes.js'

const router = express.Router()

router.get('/shapes', getAllShapes)
router.post('/generate', validate(generateSchema), generate)

export default router
