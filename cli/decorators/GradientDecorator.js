/**
 * Gradient decorator - applies gradient fill patterns
 */

import { Decorator } from './Decorator.js'

export class GradientDecorator extends Decorator {
  /**
   * Apply gradient fill pattern
   * @param {Grid} grid - Grid to decorate
   * @param {Object} params - Parameters
   * @param {string} [params.direction='horizontal'] - 'horizontal', 'vertical', 'radial'
   * @param {string} [params.densityString=' .:-=+*#%@'] - Character density map
   * @param {boolean} [params.reverse=false] - Reverse gradient direction
   */
  apply(
    grid,
    {
      direction = 'horizontal',
      densityString = ' .:-=+*#%@',
      reverse = false,
    } = {}
  ) {
    const chars = densityString.split('')
    const maxIndex = chars.length - 1

    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        if (grid.get(row, col) === ' ') {
          let ratio

          if (direction === 'horizontal') {
            ratio = col / (grid.width - 1)
          } else if (direction === 'vertical') {
            ratio = row / (grid.height - 1)
          } else if (direction === 'radial') {
            const centerRow = grid.height / 2
            const centerCol = grid.width / 2
            const maxDist = Math.sqrt(centerRow ** 2 + centerCol ** 2)
            const dist = Math.sqrt(
              (row - centerRow) ** 2 + (col - centerCol) ** 2
            )
            ratio = dist / maxDist
          }

          if (reverse) ratio = 1 - ratio

          const index = Math.min(Math.round(ratio * maxIndex), maxIndex)
          grid.set(row, col, chars[index])
        }
      }
    }
  }
}