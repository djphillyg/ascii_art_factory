/**
 * Shapes module - handles shape generation logic
 */
import {shapeArrayToString, exportShape } from './renderer.js' 

const tolerance = Number(0.5)

function generateCircle({
  radius,
  isFilled,
}) {
    // Setup: calculate grid size (diameter + 1)
    const gridSize = Number(radius)*2 +1
    // Determine center point coordinates
    // center point coordinates would be just (radius, radius)

    const centerX = radius
    const centerY = radius

    const radiusSq = radius * radius
    
    // Create 2D array/grid filled with spaces
    const grid = Array.from({ length: gridSize }, () => Array.from({length: gridSize}, () => ' '))
    
    // Iterate through every point in the grid (nested loops for x and y)
    for (let xCor = 0; xCor < gridSize; xCor++) {
      for (let yCor = 0; yCor < gridSize; yCor++) {
        // Calculate distance from current point to center using distance formula
        // Hint: deltaX = x - centerX, deltaY = y - centerY

        // Calculate distanceSquared and radiusSquared (avoid sqrt for performance)
        const deltaX = xCor - centerX
        const deltaY = yCor - centerY
        const xSq = deltaX * deltaX
        const ySq = deltaY * deltaY
        
        // Check if point is on the circle edge (within tolerance)
        // when you add these up, if they get within 0.5 of 0?
        const sum = xSq + ySq
        const diff = sum - radiusSq
        if (Math.abs(diff) < tolerance) {
          grid[xCor][yCor] = '*'
        }

        if (isFilled && (diff < 0)) {
          grid[xCor][yCor] = '*'
        }
      }
    }
    
    
    // Convert 2D grid to string output (rows joined by newlines)
    return grid
}


// function generatePolygon(sides, radius) {
//     // Setup: calculate grid size
    
//     // Determine center point
    
//     // Create 2D array/grid filled with spaces
    
//     // Calculate all vertex positions
//         // Loop from 0 to sides-1
//             // Calculate angle for this vertex: (2 * PI * i) / sides
            
//             // Calculate vertex X: centerX + radius * cos(angle)
            
//             // Calculate vertex Y: centerY + radius * sin(angle)
            
//             // Store vertex in array
    
//     // Draw edges between consecutive vertices
//         // Loop through vertices
//             // Get current vertex and next vertex (wrap around at the end)
            
//             // Call helper function to draw line between vertices
    
//     // Convert grid to string output
    
//     // Return result
// }

// function drawLine(grid, start, end) {
//     // Round start and end coordinates to integers
    
//     // Calculate number of steps needed (max of deltaX and deltaY)
    
//     // Handle edge case: if steps is 0, just draw single point
    
//     // Calculate increment per step for X and Y
    
//     // Initialize current position to start point
    
//     // Loop through steps
//         // Mark current position on grid with '*'
        
//         // Increment current X and Y by their respective increments
        
//         // Round coordinates when setting grid positions
// }

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
  isFilled = false }) {
  const rectangleArray = [];

  for (let i = 0; i < height; i += 1) {
    // If it's the first or last row, fully fill the array
    if (i === 0 || i === height - 1) {
      const line = new Array(width).fill(char);
      rectangleArray.push(line);
    } else {
      const line = [];
      if (isFilled) {
        // Fill with character
        line.push(...new Array(width).fill(char));
      } else {
        // Fill with space
        line.push(...new Array(width).fill(' '));
        // Assign the first and last to characters, rest will stay empty
        line[0] = line[line.length - 1] = char;
      }
      rectangleArray.push(line);
    }
  }

  return rectangleArray;
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
  static create(shapeType, options) {
    switch (shapeType.toLowerCase()) {
      case 'rectangle': {
        const rectangle = generateRectangle(options)

        const rectangleOutput = shapeArrayToString(rectangle)

        // if it goes to a file send it out, if not just output it
        if (options.output) {
          exportShape({
            shapeOutput: rectangleOutput,
            fileName: options.output,
            appendFile: options.append,
          })
        } else {
          console.log(rectangleOutput)
        }


        return rectangle
      }
      case 'circle': {
        const circle = generateCircle(options)

        const circleOutput = shapeArrayToString(circle)

        // if it goes to a file send it out, if not just output it
        if (options.output) {
          exportShape({
            shapeOutput: circleOutput,
            fileName: options.output,
            appendFile: options.append,
          })
        } else {
          console.log(circleOutput)
        }
        return circle
      }
      default:
        throw new Error(`Shape type "${shapeType}" is not implemented yet.`);
    }
  }
}