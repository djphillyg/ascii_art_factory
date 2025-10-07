import { exportShape } from './renderer.js'
/**
 * Transformer class for applying transformation pipelines to Grid objects
 */
class Transformer {
  /**
   * Apply a series of transformations to a grid in order
   * @param {Grid} grid - The initial grid to transform
   * @param {Array<Object>} transformations - Array of transformation objects
   * @returns {Grid} The final transformed grid
   *
   * Each transformation object should have:
   * - type: 'rotate' | 'mirror' | 'scale'
   * - params: object with parameters for the transformation
   *   - rotate: { degrees: 90 | 180 | 270 }
   *   - mirror: { axis: 'horizontal' | 'vertical' }
   *   - scale: { factor: 0.5 | 2.0 }
   *
   * @example
   * const result = Transformer.transform(grid, [
   *   { type: 'rotate', params: { degrees: 90 } },
   *   { type: 'mirror', params: { axis: 'horizontal' } },
   *   { type: 'scale', params: { factor: 2.0 } }
   * ]);
   */
  static transform({grid, transformations, options}) {
    const transformedGrid = transformations.reduce((currentGrid, transform) => {
      return this.applyTransformation(currentGrid, transform)
    }, grid)
    const stringOutput = transformedGrid.toString()
        // if it goes to a file send it out, if not just output it
    if (options.output) {
        exportShape({
          shapeOutput: stringOutput,
          fileName: options.output,
          appendFile: options.append,
        })
      } else {
          console.log(stringOutput)
      }
    return {
      grid: transformedGrid,
      output: stringOutput,
    }
  }

  /**
   * Apply a single transformation to a grid
   * @param {Grid} grid - The grid to transform
   * @param {Object} transform - The transformation to apply
   * @returns {Grid} The transformed grid
   * @private
   */
  static applyTransformation(grid, transform) {
    const { type, params } = transform

    switch (type) {
      case 'rotate':
        return grid.rotate(params.degrees)

      case 'mirror':
        return grid.mirror(params.axis)

      case 'scale':
        return grid.scale(params.factor)

      default:
        throw new Error(`Unknown transformation type: ${type}`)
    }
  }
}

export default Transformer