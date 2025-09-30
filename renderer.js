/**
 * Renderer module - handles output rendering to console or file
 */
import path from "path";
import { v4 } from "uuid";
import { writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { IOError } from './errors.js';
/**
 * Converts a 2D shape array to a string representation
 * @param {string[][]} shapeArray - 2D array representing the shape
 * @returns {string} String representation of the shape
 */
export function shapeArrayToString(shapeArray) {
  return shapeArray.map(line => line.join('')).join('\n');
}


/**
 * this function will take in a shape output and method
 * and will export it properly
 * 
 * assumes:
 * everything goes in generated_shapes/
 * 
 * 
 * @param {*} shapeOutput the shape flattened for output 
 */
export function exportShape({
  method = "text",
  shapeOutput = '',
  fileName = '',
}) {
  // generate a filename
  if (method === 'text') {
    try {
      // Check if fileName is an existing directory
      if (existsSync(fileName) && statSync(fileName).isDirectory()) {
        throw new IOError(`${fileName} is a directory, not a file`);
      }

      const uuid = v4()

      // Check if fileName contains a path separator
      let filePath;
      if (fileName.includes('/') || fileName.includes(path.sep)) {
        // User specified a path - use it as-is with UUID appended
        const dir = path.dirname(fileName);
        const base = path.basename(fileName);
        mkdirSync(dir, { recursive: true });
        filePath = path.join(dir, `${base}${uuid}.txt`);
      } else {
        // Simple filename - use generated_shapes directory
        const dir = 'generated_shapes';
        mkdirSync(dir, { recursive: true });
        filePath = path.join(dir, `${fileName}${uuid}.txt`);
      }

      writeFileSync(filePath, shapeOutput, 'utf-8')

      console.log(`FILE: ${filePath} HAS BEEN SUCCESSFULLY WRITTEN`)

      return filePath;
    } catch (error) {
      // If it's already an IOError, rethrow it
      if (error.name === 'IOError') {
        throw error;
      }

      if (error.code === 'EACCES') {
        throw new IOError(`Permission denied: Cannot write to ${fileName}`);
      } else if (error.code === 'ENOSPC') {
        throw new IOError('No space left on device');
      } else if (error.code === 'EISDIR') {
        throw new IOError(`${fileName} is a directory, not a file`);
      } else {
        throw new IOError(`Failed to write file: ${error.message}`);
      }
    }
  }
}