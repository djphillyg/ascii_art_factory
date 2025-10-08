import express from 'express'
import {transformSchema} from '../validation/schemas/transform.js'
import {generateSchema} from '../validation/schemas/generate.js'
import {validate} from '../middleware/validate.js'
import {transform} from './transform.js'
import {generate} from './generate.js'
import {getAllShapes} from './shapes.js'

const router = express.Router()

router.get('/shapes', getAllShapes)
router.post('/generate', validate(generateSchema), generate)
router.post('/transform', validate(transformSchema), transform)

export default router
