/**
 * Renderer module - handles output rendering to console or file
 */

/**
 * Renders a shape to the console
 * @param {Object} options - Rendering configuration
 * @param {string} options.shapeType - Type of shape being rendered
 * @param {string[][]} options.shapeArray - 2D array representing the shape
 */
export function printShape({ shapeType = '', shapeArray = [] }) {
  console.log(`------------- SHAPE GENERATED ----------------\n`);
  console.log(`SHAPE TYPE: ${shapeType}`);

  for (const shapeLine of shapeArray) {
    console.log(`${shapeLine.join('')}\n`);
  }
}

/**
 * Converts a 2D shape array to a string representation
 * @param {string[][]} shapeArray - 2D array representing the shape
 * @returns {string} String representation of the shape
 */
export function shapeArrayToString(shapeArray) {
  return shapeArray.map(line => line.join('')).join('\n');
}