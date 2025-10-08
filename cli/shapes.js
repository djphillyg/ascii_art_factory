/**
 * Shapes module - handles shape generation logic
 */
import { exportShape } from './renderer.js'
import { fillGrid } from './decorator.js' 
import Grid from './grid.js'


const tolerance = Number(0.5)

function generateCircle({
  radius,
  filled,
}) {
    // Setup: calculate grid size (diameter + 1)
    const gridSize = Number(radius)*2 +1
    // Determine center point coordinates
    // center point coordinates would be just (radius, radius)
    const newGrid = new Grid({ width: gridSize, height: gridSize})

    const centerCol = radius
    const centerRow = radius

    const radiusSq = radius * radius

    // Create 2D array/grid filled with spaces
    const grid = Array.from({ length: gridSize }, () => Array.from({length: gridSize}, () => ' '))

    // Iterate through every point in the grid (nested loops for row and col)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Calculate distance from current point to center using distance formula
        // col represents x-coordinate, row represents y-coordinate

        // Calculate distanceSquared and radiusSquared (avoid sqrt for performance)
        const deltaCol = col - centerCol
        const deltaRow = row - centerRow
        const colSq = deltaCol * deltaCol
        const rowSq = deltaRow * deltaRow

        // Check if point is on the circle edge (within tolerance)
        // when you add these up, if they get within 0.5 of 0?
        const sum = colSq + rowSq
        const diff = sum - radiusSq
        if (Math.abs(diff) < tolerance) {
          grid[row][col] = '*'
          // unfortunately its backwards for the grid
          newGrid.set(row, col, '*')
        }

        if (filled && (diff < 0)) {
          grid[row][col] = '*'
          newGrid.set(row, col, '*')
        }
      }
    }


    // Convert 2D grid to string output (rows joined by newlines)
    return newGrid
}


function generatePolygon({ sides, radius }) {
    // Setup: calculate grid size
    // set up the diameter
    const gridSize = radius * 2 + 1
    // Determine center point coordinates
    // center point coordinates would be just (radius, radius)

    const centerX = radius
    const centerY = radius
    
    // Create 2D array/grid filled with spaces
    let grid = Array.from({ length: gridSize }, () => Array.from({length: gridSize}, () => ' '))
    const newGrid = new Grid({ width: gridSize, height: gridSize })
    const vertexArray = []

        // Calculate all vertex positions
        // Loop from 0 to sides-1

        for (let i = 0; i < sides; i+=1) {
            // Calculate angle for this vertex: (2 * PI * i) / sides
            const angle = (2 * Math.PI * i)/sides
            
            // Calculate vertex X: centerX + radius * cos(angle)
            const vertexX = Math.round(centerX + radius * Math.cos(angle))
            // Calculate vertex Y: centerY + radius * sin(angle)
            const vertexY = Math.round(centerY + radius * Math.sin(angle))
            // Store vertex in array
            vertexArray.push([vertexX, vertexY])
        }

        for(let i = 0; i < vertexArray.length - 1; i +=1) {
          newGrid.drawLine(vertexArray[i], vertexArray[i + 1])
          grid = drawLine(grid, vertexArray[i], vertexArray[i+1])
        }
        // then connect the last one
         newGrid.drawLine(
          vertexArray[vertexArray.length - 1],
          vertexArray[0]
        )

        return newGrid
}


function drawLine(grid, start, end) {
    // start and end are [x, y] coordinates from the polygon vertices
    const [startCol, startRow] = start
    const [endCol, endRow] = end
    const startColNum = Math.round(startCol)
    const startRowNum = Math.round(startRow)
    const endColNum = Math.round(endCol)
    const endRowNum = Math.round(endRow)

    // Calculate number of steps needed (max of deltaCol and deltaRow)
    const maxSteps = Math.max(
      Math.abs(endRowNum - startRowNum),
      Math.abs(endColNum - startColNum)
    )

    // Handle edge case: if steps is 0, just draw single point
    if (maxSteps === 0) {
      return grid
    }

    // Calculate increment per step for col and row
    const colIncrement = (endColNum - startColNum) / maxSteps
    const rowIncrement = (endRowNum - startRowNum) / maxSteps

    // Initialize current position to start point
    let currCol = startColNum
    let currRow = startRowNum

    for (let i = 0; i <= maxSteps; i += 1) {
      const roundedCol = Math.round(currCol)
      const roundedRow = Math.round(currRow)

      // Only set if within grid bounds (grid[row][col] = grid[y][x])
      if (grid[roundedRow] && grid[roundedRow][roundedCol] !== undefined) {
        grid[roundedRow][roundedCol] = '*'
      }

      currCol += colIncrement
      currRow += rowIncrement
    }

    return grid
}

/**
 * Generates a rectangle as a 2D array of characters
 * @param {Object} options - Rectangle configuration
 * @param {number} options.width - Width of the rectangle
 * @param {number} options.height - Height of the rectangle
 * @param {string} options.char - Character to use for drawing (default: '*')
 * @param {boolean} options.isFilled - Whether to fill the rectangle (default: false)
 * @returns {string[][]} 2D array representing the rectangle
 */
export function generateRectangle({
  width,
  height,
  char = '*',
  filled = false }) {
  const rectangleArray = []
  // create new grid class
  const newGrid = new Grid({width, height})

  for (let i = 0; i < height; i += 1) {
    // If it's the first or last row, fully fill the array
    if (i === 0 || i === height - 1) {
      const line = new Array(width).fill(char);
      rectangleArray.push(line);
      newGrid.setRow(i, char)
    } else {
      const line = [];
      if (filled) {
        // Fill with character
        line.push(...new Array(width).fill(char));
        newGrid.setRow(i, char)
      } else {
        // Fill with space
        line.push(...new Array(width).fill(' '));
        newGrid.setRow(i, ' ')
        // Assign the first and last to characters, rest will stay empty
        line[0] = line[line.length - 1] = char;
        newGrid.set(i, 0, char)
        newGrid.set(i, width - 1, char)
      }
      rectangleArray.push(line);
    }
  }
  return newGrid
}

/**
 * Shape factory class for creating different shape types
 */
export class ShapeGenerator {
  /**
   * Creates a shape based on the provided type and options
   * @param {string} shapeType - Type of shape to create ('rectangle', etc.)
   * @param {Object} options - Shape-specific options
   * @returns {string[][]} 2D array representing the shape
   * @throws {Error} If shape type is not supported
   */
  static create({shapeType, options}) {
    let grid;

    switch (shapeType.toLowerCase()) {
      case 'rectangle': {
      grid = generateRectangle(options)
        break;
      }
      case 'circle': {
        grid = generateCircle(options)
        break;
      }
      case 'polygon': {
        grid = generatePolygon(options)
        break;
      }
      default:
        throw new Error(`Shape type "${shapeType}" is not implemented yet.`);
    }

    // Apply fill pattern if specified
    if (options.fillPattern) {
      grid = fillGrid({
        grid,
        fillPattern: options.fillPattern,
        width: options.width || grid.width(),
        height: options.height || grid.height(),
        direction: options.direction || 'horizontal',
      })
    }

    const shapeOutput = grid.toString()

    // if it goes to a file send it out, if not just output it
    if (options.output) {
      exportShape({
        shapeOutput,
        fileName: options.output,
        appendFile: options.append,
      })
    } else {
      console.log(shapeOutput)
    }

    return {
      grid,
      output: shapeOutput,
    }
  }
}