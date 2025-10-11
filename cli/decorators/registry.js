/**
 * Decorator registry for extensible Grid decorations
 */

import { DotsDecorator } from './DotsDecorator.js'
import { GradientDecorator } from './GradientDecorator.js'
import { DiagonalDecorator } from './DiagonalDecorator.js'
import { CrosshatchDecorator } from './CrosshatchDecorator.js'
import { SolidDecorator } from './SolidDecorator.js'

/**
 * Decorator registry
 * Maps decoration names to decorator instances
 */
const DecoratorRegistry = {
  // Fill patterns
  solid: new SolidDecorator(),
  dots: new DotsDecorator(),
  gradient: new GradientDecorator(),
  diagonal: new DiagonalDecorator(),
  crosshatch: new CrosshatchDecorator(),

  // Future: borders, textures, effects
  // border: new BorderDecorator(),
  // noise: new NoiseDecorator(),
  // glow: new GlowDecorator(),
}

/**
 * Get decorator by name
 * @param {string} name - Decorator name
 * @returns {Decorator} Decorator instance
 * @throws {Error} If decorator not found
 */
export function getDecorator(name) {
  const decorator = DecoratorRegistry[name]
  if (!decorator) {
    const available = Object.keys(DecoratorRegistry).join(', ')
    throw new Error(
      `Unknown decorator: ${name}. Available: ${available}`
    )
  }
  return decorator
}

/**
 * Register new decorator
 * @param {string} name - Decorator name
 * @param {Decorator} decorator - Decorator instance
 */
export function registerDecorator(name, decorator) {
  DecoratorRegistry[name] = decorator
}

export { DecoratorRegistry }