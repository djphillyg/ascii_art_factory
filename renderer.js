/**
 * Renderer module - handles output rendering to console or file
 */
import path from "path";
import { v4 } from "uuid";
import {
   appendFileSync,
   writeFileSync,
   mkdirSync,
   existsSync,
   statSync
  } from 'fs';
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
 * Resolves the file path for output, creating directories as needed
 * @param {string} fileName - The requested filename or path
 * @returns {string} The resolved file path
 */
function resolveFilePath(fileName) {
  if (fileName.includes('/') || fileName.includes(path.sep)) {
    // User specified a path - use it as-is
    const dir = path.dirname(fileName);
    mkdirSync(dir, { recursive: true });
    return fileName;
  }

  // Simple filename - use generated_shapes directory with UUID
  const dir = 'generated_shapes';
  mkdirSync(dir, { recursive: true });
  return path.join(dir, `${fileName}${v4()}.txt`);
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
  appendFile = false,
}) {
  if (method !== 'text') return;

  try {
    // Validate not a directory
    if (existsSync(fileName) && statSync(fileName).isDirectory()) {
      throw new IOError(`${fileName} is a directory, not a file`);
    }

    // Handle append mode
    if (appendFile && existsSync(fileName)) {
      appendFileSync(fileName, shapeOutput, 'utf-8');
      console.log(`FILE: ${fileName} HAS BEEN APPENDED`);
      return fileName;
    }

    // Handle new file creation
    const filePath = resolveFilePath(fileName);
    writeFileSync(filePath, shapeOutput, 'utf-8');
    console.log(`FILE: ${filePath} HAS BEEN SUCCESSFULLY WRITTEN`);
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