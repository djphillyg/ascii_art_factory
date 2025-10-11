/**
 * Base decorator interface
 * All decorators implement apply() method
 */
export class Decorator {
  /**
   * Apply decoration to grid
   * @param {Grid} _grid - Grid to decorate
   * @param {Object} _params - Decorator-specific parameters
   */
  apply(_grid, _params) {
    throw new Error('Decorator.apply() must be implemented')
  }
}