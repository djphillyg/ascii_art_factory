/**
 * Crosshatch decorator - applies crosshatch pattern
 */

import { Decorator } from './Decorator.js'

export class CrosshatchDecorator extends Decorator {
  /**
   * Apply crosshatch pattern
   * @param {Grid} grid - Grid to decorate
   * @param {Object} _params - Parameters (currently unused)
   */
  apply(grid, _params = {}) {
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        if (grid.get(row, col) === ' ') {
          const rowEven = row % 2
          const colEven = col % 2

          grid.set(
            row,
            col,
            (rowEven && !colEven) || (!rowEven && colEven) ? '/' : '\\'
          )
        }
      }
    }
  }
}