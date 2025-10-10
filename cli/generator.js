import { ShapeGenerator } from './shapes.js'
import { TextGenerator } from './text.js'
import Grid from '../cli/grid.js'

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

export function generateV2(type, options) {
  if (type === 'circle') {
    return Grid.generateCircle(options)
  } else if (type === 'rectangle') {
    return Grid.generateRectangle(options)
  } else if (type === 'polygon') {
    return Grid.generatePolygon(options)
  } else if (type === 'text') {
    return Grid.createText(options)
  }
  throw new Error(`Unknown type: ${type}`)
}
