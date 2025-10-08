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
    for (let i = 0; i < grid.height; i++) {
      for (let j = 0; j < grid.width; j++) {
        if (grid.get(i, j) === ' ') {
          grid.set(i, j, '.')
        }
      }
    }
  }

  if (fillPattern === 'gradient') {
    // if gradient, calculate position ratios on each empty grid space
    for (let i = 0; i < grid.height; i++) {
      for (let j = 0; j < grid.width; j++) {
        if (grid.get(i, j) === ' ') {
          const xRatio = j / (width - 1)
          const yRatio = i / (height - 1)
          if (direction === 'horizontal') {
            grid.set(i, j, densityString[Math.round(10 * xRatio)])
          } else if (direction === 'vertical') {
            grid.set(i, j, densityString[Math.round(10 * yRatio)])
          }
        }
      }
    }
  }

  if (fillPattern === 'diagonal') {
    // fill it with alternating forward slashes
    for (let i = 0; i < grid.height; i++) {
      for (let j = 0; j < grid.width; j++) {
        if (grid.get(i, j) === ' ') {
          // if odd row do 1, 3, 5
          // if even row do 2, 4, 6
          // for now programtically write it mods and see what happens
          /**
           * for val we check if its a mod 0 ? (0, 2, 4) and
           */
          const rowEven = i%2
          const colEven = j%2

          grid.set(i, j, ((rowEven && !colEven) || (!rowEven && colEven)) ? '/' : ' ')
        }
      }
    }
  }

  if (fillPattern=== 'crosshatch') {
        // fill it with alternating forward slashes
    for (let i = 0; i < grid.height; i++) {
      for (let j = 0; j < grid.width; j++) {
        if (grid.get(i, j) === ' ') {
          // if odd row do 1, 3, 5
          // if even row do 2, 4, 6
          // for now programtically write it mods and see what happens
          /**
           * for val we check if its a mod 0 ? (0, 2, 4) and
           */
          const rowEven = i%2
          const colEven = j%2

          grid.set(i,j, ((rowEven && !colEven) || (!rowEven && colEven)) ? '/' : '\\')
        }
      }
    }
  }

  return grid
}