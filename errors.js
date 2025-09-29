/**
 * Custom Error classes for better error handling and debugging
 */

/**
 * Base error class for CLI-related errors
 */
export class CLIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CLIError';
  }
}

/**
 * Error thrown when validation of input arguments fails
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when shape generation fails
 */
export class ShapeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ShapeError';
  }
}

/**
 * Error thrown when parsing arguments fails
 */
export class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParseError';
  }
}

/**
 * Error thrown when rendering output fails
 */
export class RenderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RenderError';
  }
}