/**
 * Shapes module - handles shape generation logic
 */
import { exportShape } from './renderer.js';
import { fillGrid } from './decorator.js';
import Grid from './grid.js';

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
  static create({ shapeType, options }) {
    let grid;

    switch (shapeType.toLowerCase()) {
      case 'rectangle': {
        grid = Grid.generateRectangle(options);
        break;
      }
      case 'circle': {
        grid = Grid.generateCircle(options);
        break;
      }
      case 'polygon': {
        grid = Grid.generatePolygon(options);
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
      });
    }

    const shapeOutput = grid.toString();

    // if it goes to a file send it out, if not just output it
    if (options.output) {
      exportShape({
        shapeOutput,
        fileName: options.output,
        appendFile: options.append,
      });
    } else {
      console.log(shapeOutput);
    }

    return {
      grid,
      output: shapeOutput,
    };
  }
}
