/**
 * Decorator module - handles fill patterns for shapes and text
 */

const densityString = ' .:-=+*#%@'

/**
 * Fills a grid with a specified pattern
 * @param {Object} options - Fill configuration
 * @param {string[][]} options.grid - The 2D grid to fill
 * @param {string} options.fillPattern - The pattern to use ('dots' or 'gradient')
 * @param {number} options.width - Width of the grid (required for gradient)
 * @param {number} options.height - Height of the grid (required for gradient)
 * @param {string} options.direction - Direction for gradient ('horizontal' or 'vertical', default: 'horizontal')
 * @returns {string[][]} The filled grid
 */
export function fillGrid({
  grid,
  fillPattern,
  width,
  height,
  direction = 'horizontal',
}) {
  if (fillPattern === 'dots') {
    // if its dots, you just put a dot everywhere there is a space
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === ' ') {
          grid[i][j] = '.'
        }
      }
    }
  }

  if (fillPattern === 'gradient') {
    // if gradient, calculate position ratios on each empty grid space
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === ' ') {
          const xRatio = j / (width - 1)
          const yRatio = i / (height - 1)
          if (direction === 'horizontal') {
            grid[i][j] = densityString[Math.round(10 * xRatio)]
          } else if (direction === 'vertical') {
            grid[i][j] = densityString[Math.round(10 * yRatio)]
          }
        }
      }
    }
  }

  return grid
}