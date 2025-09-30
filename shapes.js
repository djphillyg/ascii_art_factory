/**
 * Shapes module - handles shape generation logic
 */
import {shapeArrayToString, exportShape } from './renderer.js' 

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
      } default:
        throw new Error(`Shape type "${shapeType}" is not implemented yet.`);
    }
  }
}