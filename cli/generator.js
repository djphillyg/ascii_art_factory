import { ShapeGenerator } from './shapes.js'
import { TextGenerator } from './text.js'

const shapeTypes = ['circle', 'polygon', 'rectangle']


export function generate(type, options) {
    if (shapeTypes.includes(type)) {
        return ShapeGenerator.create({
            shapeType: type,
            options,
        })
    }
    if (type === 'text') {
        return TextGenerator.create(options)
    }
    throw new Error(`Unknown type: ${type}`)
}

