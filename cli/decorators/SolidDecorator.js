/**
 * Solid decorator - fills all spaces with a character
 */

import { Decorator } from './Decorator.js'

export class SolidDecorator extends Decorator {
  /**
   * Fill all spaces with a solid character
   * @param {Grid} grid - Grid to decorate
   * @param {Object} params - Parameters
   * @param {string} [params.char='*'] - Fill character
   */
  apply(grid, { char = '*' } = {}) {
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        if (grid.get(row, col) === ' ') {
          grid.set(row, col, char)
        }
      }
    }
  }
}