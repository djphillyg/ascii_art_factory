import { describe, test, expect } from 'vitest'
import Grid from '../../cli/grid.js'
import { DotsDecorator } from '../../cli/decorators/DotsDecorator.js'
import { GradientDecorator } from '../../cli/decorators/GradientDecorator.js'
import { DiagonalDecorator } from '../../cli/decorators/DiagonalDecorator.js'
import { CrosshatchDecorator } from '../../cli/decorators/CrosshatchDecorator.js'
import { SolidDecorator } from '../../cli/decorators/SolidDecorator.js'
import { getDecorator, registerDecorator, DecoratorRegistry } from '../../cli/decorators/registry.js'

describe('DotsDecorator', () => {
  test('should replace all spaces with dots using default character', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new DotsDecorator()

    decorator.apply(grid)

    // Verify all cells contain '.' character
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(grid.get(row, col)).toBe('.')
      }
    }
  })

  test('should support custom dot character', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new DotsDecorator()

    decorator.apply(grid, { char: 'o' })

    // Verify all cells contain 'o' character
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(grid.get(row, col)).toBe('o')
      }
    }
  })

  test('should not overwrite existing non-space characters', () => {
    const grid = new Grid({ width: 5, height: 5 })
    grid.set(2, 2, '*')
    grid.set(1, 3, '*')
    const decorator = new DotsDecorator()

    decorator.apply(grid)

    // Verify '*' characters are preserved
    expect(grid.get(2, 2)).toBe('*')
    expect(grid.get(1, 3)).toBe('*')
    // Verify spaces became '.'
    expect(grid.get(0, 0)).toBe('.')
    expect(grid.get(4, 4)).toBe('.')
  })

  test('should support density parameter for partial filling', () => {
    const grid = new Grid({ width: 100, height: 100 })
    const decorator = new DotsDecorator()

    decorator.apply(grid, { char: '.', density: 0.5 })

    // Count dots
    let dotCount = 0
    for (let row = 0; row < 100; row++) {
      for (let col = 0; col < 100; col++) {
        if (grid.get(row, col) === '.') dotCount++
      }
    }

    // Verify approximately 50% are filled (with tolerance)
    expect(dotCount).toBeGreaterThan(4000)
    expect(dotCount).toBeLessThan(6000)
  })
})

describe('GradientDecorator', () => {
  test('should apply horizontal gradient from left to right', () => {
    const grid = new Grid({ width: 11, height: 5 })
    const decorator = new GradientDecorator()

    decorator.apply(grid, { direction: 'horizontal' })

    const densityString = ' .:-=+*#%@'
    const leftChar = grid.get(2, 0)
    const rightChar = grid.get(2, 10)

    // Verify leftmost column has lighter chars than rightmost column
    expect(densityString.indexOf(leftChar)).toBeLessThan(
      densityString.indexOf(rightChar)
    )
  })

  test('should apply vertical gradient from top to bottom', () => {
    const grid = new Grid({ width: 5, height: 11 })
    const decorator = new GradientDecorator()

    decorator.apply(grid, { direction: 'vertical' })

    const densityString = ' .:-=+*#%@'
    const topChar = grid.get(0, 2)
    const bottomChar = grid.get(10, 2)

    // Verify top row has lighter chars than bottom row
    expect(densityString.indexOf(topChar)).toBeLessThan(
      densityString.indexOf(bottomChar)
    )
  })

  test('should apply radial gradient from center outward', () => {
    const grid = new Grid({ width: 21, height: 21 })
    const decorator = new GradientDecorator()

    decorator.apply(grid, { direction: 'radial' })

    const densityString = ' .:-=+*#%@'
    const centerChar = grid.get(10, 10)
    const edgeChar = grid.get(0, 0)

    // Verify center cell has lighter char than corner cells
    expect(densityString.indexOf(centerChar)).toBeLessThan(
      densityString.indexOf(edgeChar)
    )
  })

  test('should support reverse gradient direction', () => {
    const grid = new Grid({ width: 11, height: 5 })
    const decorator = new GradientDecorator()

    decorator.apply(grid, { direction: 'horizontal', reverse: true })

    const densityString = ' .:-=+*#%@'
    const leftChar = grid.get(2, 0)
    const rightChar = grid.get(2, 10)

    // Verify leftmost column has darker chars than rightmost (reversed)
    expect(densityString.indexOf(leftChar)).toBeGreaterThan(
      densityString.indexOf(rightChar)
    )
  })

  test('should support custom density string', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new GradientDecorator()

    decorator.apply(grid, { direction: 'horizontal', densityString: 'abc' })

    // Verify all cells only contain 'a', 'b', or 'c' characters
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(['a', 'b', 'c']).toContain(grid.get(row, col))
      }
    }
  })

  test('should not overwrite existing characters', () => {
    const grid = new Grid({ width: 5, height: 5 })
    grid.set(2, 2, '*')
    grid.set(1, 3, '*')
    const decorator = new GradientDecorator()

    decorator.apply(grid, { direction: 'horizontal' })

    // Verify '*' characters remain unchanged
    expect(grid.get(2, 2)).toBe('*')
    expect(grid.get(1, 3)).toBe('*')
  })
})

describe('DiagonalDecorator', () => {
  test('should apply diagonal slash pattern with default character', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new DiagonalDecorator()

    decorator.apply(grid)

    // Check specific positions match expected pattern
    // row 0 (even), col 1 (odd) should be '/'
    expect(grid.get(0, 1)).toBe('/')
    // row 1 (odd), col 0 (even) should be '/'
    expect(grid.get(1, 0)).toBe('/')
    // row 0 (even), col 0 (even) should be ' '
    expect(grid.get(0, 0)).toBe(' ')
    // row 1 (odd), col 1 (odd) should be ' '
    expect(grid.get(1, 1)).toBe(' ')
  })

  test('should support custom diagonal character', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new DiagonalDecorator()

    decorator.apply(grid, { char: '|' })

    // Verify pattern uses '|' character instead of '/'
    expect(grid.get(0, 1)).toBe('|')
    expect(grid.get(1, 0)).toBe('|')
  })

  test('should not overwrite existing characters', () => {
    const grid = new Grid({ width: 5, height: 5 })
    grid.set(0, 1, '*')
    const decorator = new DiagonalDecorator()

    decorator.apply(grid)

    // Verify existing characters are preserved
    expect(grid.get(0, 1)).toBe('*')
  })
})

describe('CrosshatchDecorator', () => {
  test('should apply crosshatch pattern with forward and back slashes', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new CrosshatchDecorator()

    decorator.apply(grid)

    // Check specific positions for correct slash direction
    // row 0 (even), col 1 (odd) should be '/'
    expect(grid.get(0, 1)).toBe('/')
    // row 0 (even), col 0 (even) should be '\\'
    expect(grid.get(0, 0)).toBe('\\')
    // row 1 (odd), col 0 (even) should be '/'
    expect(grid.get(1, 0)).toBe('/')
    // row 1 (odd), col 1 (odd) should be '\\'
    expect(grid.get(1, 1)).toBe('\\')
  })

  test('should not overwrite existing characters', () => {
    const grid = new Grid({ width: 5, height: 5 })
    grid.set(2, 2, '*')
    const decorator = new CrosshatchDecorator()

    decorator.apply(grid)

    // Verify '*' characters remain, only spaces get slashes
    expect(grid.get(2, 2)).toBe('*')
    // Check that other positions have slashes
    expect(['/', '\\']).toContain(grid.get(0, 0))
  })
})

describe('SolidDecorator', () => {
  test('should fill all spaces with default character', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new SolidDecorator()

    decorator.apply(grid)

    // Verify all cells contain '*' character
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(grid.get(row, col)).toBe('*')
      }
    }
  })

  test('should support custom fill character', () => {
    const grid = new Grid({ width: 5, height: 5 })
    const decorator = new SolidDecorator()

    decorator.apply(grid, { char: '#' })

    // Verify all cells contain '#' character
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(grid.get(row, col)).toBe('#')
      }
    }
  })

  test('should not overwrite existing characters', () => {
    const grid = new Grid({ width: 5, height: 5 })
    grid.set(2, 2, 'X')
    grid.set(1, 3, 'O')
    const decorator = new SolidDecorator()

    decorator.apply(grid)

    // Verify only spaces are replaced, existing chars preserved
    expect(grid.get(2, 2)).toBe('X')
    expect(grid.get(1, 3)).toBe('O')
    // Verify spaces became '*'
    expect(grid.get(0, 0)).toBe('*')
  })
})

describe('Decorator Registry', () => {
  test('should retrieve decorators by name', () => {
    const decorator = getDecorator('dots')

    // Verify it returns a DotsDecorator instance
    expect(decorator).toBeInstanceOf(DotsDecorator)
    // Verify it has an apply method
    expect(typeof decorator.apply).toBe('function')
  })

  test('should throw error for unknown decorator name', () => {
    // Attempt getDecorator('nonexistent')
    expect(() => getDecorator('nonexistent')).toThrow()

    // Verify error message lists available decorators
    try {
      getDecorator('nonexistent')
    } catch (error) {
      expect(error.message).toContain('Unknown decorator')
      expect(error.message).toContain('dots')
    }
  })

  test('should list all available decorators in registry', () => {
    const decorators = Object.keys(DecoratorRegistry)

    // Verify it contains expected decorators
    expect(decorators).toContain('solid')
    expect(decorators).toContain('dots')
    expect(decorators).toContain('gradient')
    expect(decorators).toContain('diagonal')
    expect(decorators).toContain('crosshatch')
    // Verify it has exactly 5 decorators
    expect(decorators.length).toBe(5)
  })

  test('should allow registering new decorators dynamically', () => {
    // Create a mock decorator with apply method
    const mockDecorator = {
      apply: (grid, params) => {
        // Mock implementation
      }
    }

    // Register the decorator
    registerDecorator('custom', mockDecorator)

    // Verify getDecorator('custom') returns the mock decorator
    expect(getDecorator('custom')).toBe(mockDecorator)

    // Clean up by removing it from registry
    delete DecoratorRegistry.custom
  })
})