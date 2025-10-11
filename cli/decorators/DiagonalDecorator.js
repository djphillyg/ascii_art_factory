/**
 * Diagonal decorator - applies diagonal line pattern
 */

import { Decorator } from './Decorator.js'

export class DiagonalDecorator extends Decorator {
  /**
   * Apply diagonal line pattern
   * @param {Grid} grid - Grid to decorate
   * @param {Object} params - Parameters
   * @param {string} [params.char='/'] - Line character
   */
  apply(grid, { char = '/' } = {}) {
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        if (grid.get(row, col) === ' ') {
          const rowEven = row % 2
          const colEven = col % 2

          if ((rowEven && !colEven) || (!rowEven && colEven)) {
            grid.set(row, col, char)
          }
        }
      }
    }
  }
}