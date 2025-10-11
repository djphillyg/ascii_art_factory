/**
 * Dots decorator - replaces spaces with dots
 */

import { Decorator } from './Decorator.js'

export class DotsDecorator extends Decorator {
  /**
   * Replace all spaces with dots
   * @param {Grid} grid - Grid to decorate
   * @param {Object} params - Parameters
   * @param {string} [params.char='.'] - Dot character
   * @param {number} [params.density=1.0] - Dot density (0-1)
   */
  apply(grid, { char = '.', density = 1.0 } = {}) {
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        if (grid.get(row, col) === ' ') {
          // Apply density filter
          if (Math.random() < density) {
            grid.set(row, col, char)
          }
        }
      }
    }
  }
}