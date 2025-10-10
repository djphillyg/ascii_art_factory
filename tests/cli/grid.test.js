import { describe, test, expect } from 'vitest'
import Grid from '../../cli/grid.js'

describe('Grid Constructor', () => {
  test('should create empty grid with width and height', () => {
    const grid = new Grid({ width: 5, height: 3 })

    expect(grid.width).toBe(5)
    expect(grid.height).toBe(3)
    expect(grid.toString()).toBe('     \n     \n     ')
  })

  test('should create grid from content string', () => {
    const content = '***\n* *\n***'
    const grid = new Grid({ content })

    expect(grid.width).toBe(3)
    expect(grid.height).toBe(3)
    expect(grid.toString()).toBe(content)
  })

  test('should handle content with varying line lengths', () => {
    const content = '*\n***\n*'
    const grid = new Grid({ content })

    expect(grid.width).toBe(3)
    expect(grid.height).toBe(3)
    expect(grid.get(0, 0)).toBe('*')
    expect(grid.get(0, 1)).toBe(' ')
    expect(grid.get(1, 2)).toBe('*')
  })
})

describe('Grid Static Generators', () => {
  describe('generateCircle', () => {
    test('should generate hollow circle with radius 3', () => {
      const grid = Grid.generateCircle({ radius: 3, filled: false })

      expect(grid.width).toBe(7)
      expect(grid.height).toBe(7)
      expect(grid.toString()).toContain('*')
    })

    test('should generate filled circle with radius 3', () => {
      const grid = Grid.generateCircle({ radius: 3, filled: true })

      const asteriskCount = (grid.toString().match(/\*/g) || []).length
      expect(asteriskCount).toBeGreaterThan(10)
    })

    test('should generate circle with radius 1', () => {
      const grid = Grid.generateCircle({ radius: 1, filled: false })

      expect(grid.width).toBe(3)
      expect(grid.height).toBe(3)
    })
  })

  describe('generateRectangle', () => {
    test('should generate hollow rectangle', () => {
      const grid = Grid.generateRectangle({ width: 5, height: 3, filled: false })

      expect(grid.width).toBe(5)
      expect(grid.height).toBe(3)
      expect(grid.toString()).toBe('*****\n*   *\n*****')
    })

    test('should generate filled rectangle', () => {
      const grid = Grid.generateRectangle({ width: 4, height: 3, filled: true })

      expect(grid.toString()).toBe('****\n****\n****')
    })

    test('should use custom character', () => {
      const grid = Grid.generateRectangle({ width: 3, height: 2, char: '#', filled: false })

      expect(grid.toString()).toBe('###\n###')
    })

    test('should generate 1x1 rectangle', () => {
      const grid = Grid.generateRectangle({ width: 1, height: 1, filled: false })

      expect(grid.toString()).toBe('*')
    })
  })

  describe('generatePolygon', () => {
    test('should generate polygon with 4 sides', () => {
      const grid = Grid.generatePolygon({ sides: 4, radius: 3 })

      expect(grid.width).toBe(7)
      expect(grid.height).toBe(7)
      expect(grid.toString()).toContain('*')
    })

    test('should generate polygon with 6 sides', () => {
      const grid = Grid.generatePolygon({ sides: 6, radius: 4 })

      expect(grid.width).toBe(9)
      expect(grid.height).toBe(9)
      expect(grid.toString()).toContain('*')
    })
  })

  describe('createText', () => {
    test('should create text grid for single character', () => {
      const grid = Grid.createText({ text: 'A' })

      expect(grid.width).toBe(5)
      expect(grid.height).toBe(5)
      expect(grid.toString()).toContain('*')
    })

    test('should create text grid for multiple characters', () => {
      const grid = Grid.createText({ text: 'HI' })

      expect(grid.width).toBeGreaterThan(5)
      expect(grid.height).toBe(5)
      expect(grid.toString()).toContain('*')
    })

    test('should create text grid with numbers', () => {
      const grid = Grid.createText({ text: '123' })

      expect(grid.height).toBe(5)
      expect(grid.toString()).toContain('*')
    })
  })
})

describe('Grid Instance Methods', () => {
  describe('set and get', () => {
    test('should set and get character at position', () => {
      const grid = new Grid({ width: 3, height: 3 })

      grid.set(1, 1, '*')
      expect(grid.get(1, 1)).toBe('*')
    })

    test('should return null for out of bounds get', () => {
      const grid = new Grid({ width: 3, height: 3 })

      expect(grid.get(5, 5)).toBe(null)
      expect(grid.get(-1, 0)).toBe(null)
    })

    test('should not set out of bounds', () => {
      const grid = new Grid({ width: 3, height: 3 })

      grid.set(5, 5, '*')
      expect(grid.get(5, 5)).toBe(null)
    })
  })

  describe('setRow', () => {
    test('should set entire row to character', () => {
      const grid = new Grid({ width: 5, height: 3 })

      grid.setRow(1, '*')
      expect(grid.getRowStr(1)).toBe('*****')
    })

    test('should not set row out of bounds', () => {
      const grid = new Grid({ width: 3, height: 3 })

      grid.setRow(5, '*')
      expect(grid.hasRow(5)).toBe(false)
    })
  })

  describe('hasRow and getRowStr', () => {
    test('should check if row exists', () => {
      const grid = new Grid({ width: 3, height: 3 })

      expect(grid.hasRow(0)).toBe(true)
      expect(grid.hasRow(2)).toBe(true)
      expect(grid.hasRow(3)).toBe(false)
    })

    test('should get row as string', () => {
      const grid = new Grid({ content: '***\n* *\n***' })

      expect(grid.getRowStr(0)).toBe('***')
      expect(grid.getRowStr(1)).toBe('* *')
      expect(grid.getRowStr(2)).toBe('***')
    })
  })

  describe('toArray and toString', () => {
    test('should convert to 2D array', () => {
      const grid = new Grid({ content: '**\n**' })
      const arr = grid.toArray()

      expect(arr).toEqual([
        ['*', '*'],
        ['*', '*']
      ])
    })

    test('should convert to string', () => {
      const grid = new Grid({ width: 2, height: 2 })
      grid.set(0, 0, '*')
      grid.set(1, 1, '*')

      expect(grid.toString()).toBe('* \n *')
    })
  })

  describe('rightAppend', () => {
    test('should append grids horizontally', () => {
      const grid1 = new Grid({ content: '***\n***' })
      const grid2 = new Grid({ content: '##\n##' })

      const result = grid1.rightAppend(grid2)
      expect(result.toString()).toBe('*** ##\n*** ##')
    })

    test('should handle grids of different heights', () => {
      const grid1 = new Grid({ content: '*' })
      const grid2 = new Grid({ content: '#\n#\n#' })

      const result = grid1.rightAppend(grid2)
      expect(result.height).toBe(3)
    })
  })
})

describe('Grid Transformations', () => {
  describe('rotate', () => {
    test('should rotate 90 degrees clockwise', () => {
      const grid = new Grid({ content: '***\n*  \n***' })
      const rotated = grid.rotate(90)

      expect(rotated.width).toBe(3)
      expect(rotated.height).toBe(3)
      expect(rotated.get(0, 0)).toBe('*')
      expect(rotated.get(0, 2)).toBe('*')
    })

    test('should rotate 180 degrees', () => {
      const grid = new Grid({ content: '***\n*  \n***' })
      const rotated = grid.rotate(180)

      expect(rotated.width).toBe(3)
      expect(rotated.height).toBe(3)
      expect(rotated.toString()).toBe('***\n  *\n***')
    })

    test('should rotate 270 degrees clockwise', () => {
      const grid = new Grid({ content: '***\n*  \n***' })
      const rotated = grid.rotate(270)

      expect(rotated.width).toBe(3)
      expect(rotated.height).toBe(3)
    })

    test('should throw error for invalid degrees', () => {
      const grid = new Grid({ width: 3, height: 3 })

      expect(() => grid.rotate(45)).toThrow('Improper degree amount specified')
    })
  })

  describe('mirror', () => {
    test('should mirror horizontally', () => {
      const grid = new Grid({ content: '*  \n** \n***' })
      const mirrored = grid.mirror('horizontal')

      expect(mirrored.toString()).toBe('  *\n **\n***')
    })

    test('should mirror vertically', () => {
      const grid = new Grid({ content: '***\n** \n*  ' })
      const mirrored = grid.mirror('vertical')

      expect(mirrored.toString()).toBe('*  \n** \n***')
    })

    test('should throw error for invalid axis', () => {
      const grid = new Grid({ width: 3, height: 3 })

      expect(() => grid.mirror('diagonal')).toThrow('Axis not allowed')
    })
  })

  describe('scale', () => {
    test('should scale up by 2x', () => {
      const grid = new Grid({ content: '**\n**' })
      const scaled = grid.scale(2.0)

      expect(scaled.width).toBe(4)
      expect(scaled.height).toBe(4)
      expect(scaled.toString()).toBe('****\n****\n****\n****')
    })

    test('should scale down by 0.5x', () => {
      const grid = new Grid({ content: '****\n****\n****\n****' })
      const scaled = grid.scale(0.5)

      expect(scaled.width).toBe(2)
      expect(scaled.height).toBe(2)
      expect(scaled.toString()).toBe('**\n**')
    })

    test('should throw error for invalid factor', () => {
      const grid = new Grid({ width: 3, height: 3 })

      expect(() => grid.scale(3.0)).toThrow('factor to scale is not included')
    })
  })

  describe('applyTransformation', () => {
    test('should apply rotate transformation', () => {
      const grid = new Grid({ content: '**\n* ' })
      const transformed = Grid.applyTransformation(grid, {
        type: 'rotate',
        params: { degrees: 90 }
      })

      expect(transformed.width).toBe(2)
      expect(transformed.height).toBe(2)
    })

    test('should apply mirror transformation', () => {
      const grid = new Grid({ content: '*  ' })
      const transformed = Grid.applyTransformation(grid, {
        type: 'mirror',
        params: { axis: 'horizontal' }
      })

      expect(transformed.toString()).toBe('  *')
    })

    test('should apply scale transformation', () => {
      const grid = new Grid({ content: '**\n**' })
      const transformed = Grid.applyTransformation(grid, {
        type: 'scale',
        params: { factor: 2.0 }
      })

      expect(transformed.width).toBe(4)
      expect(transformed.height).toBe(4)
    })

    test('should throw error for unknown transformation', () => {
      const grid = new Grid({ width: 3, height: 3 })

      expect(() => Grid.applyTransformation(grid, {
        type: 'unknown',
        params: {}
      })).toThrow('Unknown transformation type')
    })
  })
})

describe('Grid Composition Methods', () => {
  describe('overlay', () => {
    test('should overlay grid at position', () => {
      const baseGrid = new Grid({ width: 5, height: 5 })
      const topGrid = new Grid({ content: '**\n**' })

      baseGrid.overlay(topGrid, { row: 1, col: 1 })

      expect(baseGrid.get(1, 1)).toBe('*')
      expect(baseGrid.get(1, 2)).toBe('*')
      expect(baseGrid.get(2, 1)).toBe('*')
      expect(baseGrid.get(2, 2)).toBe('*')
    })

    test('should respect transparent option', () => {
      const baseGrid = new Grid({ content: '*****\n*****' })
      const topGrid = new Grid({ content: '* *' })

      baseGrid.overlay(topGrid, { row: 0, col: 0, char: null, transparent: true })

      // transparent mode: spaces from source should not overwrite
      expect(baseGrid.get(0, 0)).toBe('*')  // first char from source
      expect(baseGrid.get(0, 1)).toBe('*')  // space from source skipped, base remains
      expect(baseGrid.get(0, 2)).toBe('*')  // last char from source
    })

    test('should return this for chaining', () => {
      const baseGrid = new Grid({ width: 5, height: 5 })
      const topGrid = new Grid({ content: '**' })

      const result = baseGrid.overlay(topGrid, { row: 0, col: 0 })
      expect(result).toBe(baseGrid)
    })
  })

  describe('placeAt', () => {
    test('should be alias for overlay', () => {
      const baseGrid = new Grid({ width: 5, height: 5 })
      const topGrid = new Grid({ content: '**' })

      baseGrid.placeAt(topGrid, { row: 1, col: 1 })

      expect(baseGrid.get(1, 1)).toBe('*')
      expect(baseGrid.get(1, 2)).toBe('*')
    })
  })

  describe('clip', () => {
    test('should clip region from grid', () => {
      const grid = new Grid({ content: '*****\n*###*\n*****' })
      const clipped = grid.clip({ startRow: 1, endRow: 2, startCol: 1, endCol: 4 })

      expect(clipped.width).toBe(3)
      expect(clipped.height).toBe(1)
      expect(clipped.toString()).toBe('###')
    })

    test('should clamp bounds to grid dimensions', () => {
      const grid = new Grid({ content: '**\n**' })
      const clipped = grid.clip({ startRow: 0, endRow: 10, startCol: 0, endCol: 10 })

      expect(clipped.width).toBe(2)
      expect(clipped.height).toBe(2)
    })
  })

  describe('getBounds', () => {
    test('should return width and height', () => {
      const grid = new Grid({ width: 7, height: 5 })
      const bounds = grid.getBounds()

      expect(bounds.width).toBe(7)
      expect(bounds.height).toBe(5)
    })
  })

  describe('getCenterPoint', () => {
    test('should return center point', () => {
      const grid = new Grid({ width: 5, height: 5 })
      const center = grid.getCenterPoint()

      expect(center.row).toBe(2)
      expect(center.col).toBe(2)
    })

    test('should floor center point for odd dimensions', () => {
      const grid = new Grid({ width: 6, height: 6 })
      const center = grid.getCenterPoint()

      expect(center.row).toBe(3)
      expect(center.col).toBe(3)
    })
  })

  describe('getContentBounds', () => {
    test('should find content bounds', () => {
      const grid = new Grid({ width: 10, height: 10 })
      grid.set(2, 3, '*')
      grid.set(5, 7, '*')

      const bounds = grid.getContentBounds()

      expect(bounds.minRow).toBe(2)
      expect(bounds.maxRow).toBe(5)
      expect(bounds.minCol).toBe(3)
      expect(bounds.maxCol).toBe(7)
    })

    test('should return grid dimensions in bounds', () => {
      const grid = new Grid({ width: 8, height: 6 })
      const bounds = grid.getContentBounds()

      expect(bounds.width).toBe(8)
      expect(bounds.height).toBe(6)
    })
  })
})

describe('Grid Event Emitter', () => {
  test('should emit cellUpdated event on set', () => {
    return new Promise((resolve) => {
      const grid = new Grid({ width: 3, height: 3 })

      grid.on('cellUpdated', (data) => {
        expect(data.row).toBe(1)
        expect(data.col).toBe(1)
        expect(data.char).toBe('*')
        resolve()
      })

      grid.set(1, 1, '*')
    })
  })

  test('should emit rowCompleted events on streamRowsV1', () => {
    return new Promise((resolve) => {
      const grid = new Grid({ content: '**\n**' })
      let rowCount = 0

      grid.on('rowCompleted', (data) => {
        rowCount++
        expect(data.total).toBe(2)
      })

      grid.on('complete', () => {
        expect(rowCount).toBe(2)
        resolve()
      })

      grid.streamRowsV1()
    })
  })
})

describe('Grid Edge Cases', () => {
  test('should handle empty content string', () => {
    const grid = new Grid({ width: 3, height: 3, content: '' })

    expect(grid.width).toBe(3)
    expect(grid.height).toBe(3)
  })

  test('should handle single character grid', () => {
    const grid = new Grid({ content: '*' })

    expect(grid.width).toBe(1)
    expect(grid.height).toBe(1)
    expect(grid.toString()).toBe('*')
  })
})