/**
 * Grid class for managing a 2D character grid
 */
import _ from 'lodash'
import { getGridCharMap } from './char_mapping.js'
import EventEmitter from 'events'

class Grid extends EventEmitter {
  static tolerance = Number(0.5)
  /**
   * Create a new Grid
   * @param {Object} options - Grid configuration
   * @param {number} [options.width] - The width of the grid (required if content is empty)
   * @param {number} [options.height] - The height of the grid (required if content is empty)
   * @param {string} [options.content=''] - Optional string content to parse (newline-separated)
   */
  constructor({ width, height, content = '' }) {
    super()
    // If content is provided and not empty, initialize from string
    if (content && content.trim().length > 0) {
      this.initFromString(content)
    } else {
      // Normal constructor: width and height provided
      this.width = width
      this.height = height

      // Initialize 2D array filled with spaces
      this.grid = Array(height)
        .fill(null)
        .map(() => Array(width).fill(' '))
    }
  }

  // -------- Static Factory Methods --------

  /**
   * Generate a circle grid
   * @param {Object} options - Circle options
   * @param {number} options.radius - Radius of the circle
   * @param {boolean} options.filled - Whether the circle should be filled
   * @param {string} [options.char='*'] - Character to use for drawing
   * @returns {Grid} New grid instance with the circle drawn
   */
  static generateCircle({ radius, filled, char = '*' }) {
    // Setup: calculate grid size (diameter + 1)
    const gridSize = Number(radius) * 2 + 1
    // Determine center point coordinates
    // center point coordinates would be just (radius, radius)
    const newGrid = new Grid({ width: gridSize, height: gridSize })

    const centerCol = radius
    const centerRow = radius

    const radiusSq = radius * radius
    // Iterate through every point in the grid (nested loops for row and col)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Calculate distance from current point to center using distance formula
        // col represents x-coordinate, row represents y-coordinate

        // Calculate distanceSquared and radiusSquared (avoid sqrt for performance)
        const deltaCol = col - centerCol
        const deltaRow = row - centerRow
        const colSq = deltaCol * deltaCol
        const rowSq = deltaRow * deltaRow

        // Check if point is on the circle edge (within tolerance)
        // when you add these up, if they get within 0.5 of 0?
        const sum = colSq + rowSq
        const diff = sum - radiusSq
        if (Math.abs(diff) < this.tolerance) {
          // unfortunately its backwards for the grid
          newGrid.set(row, col, char)
        }

        if (filled && diff < 0) {
          newGrid.set(row, col, char)
        }
      }
    }

    return newGrid
  }

  /**
   * Generate a polygon grid
   * @param {Object} options - Polygon options
   * @param {number} options.sides - Number of sides for the polygon
   * @param {number} options.radius - Radius of the polygon
   * @returns {Grid} New grid instance with the polygon drawn
   */
  static generatePolygon({ sides, radius, filled = false, char = '*' }) {
    // Setup: calculate grid size
    // set up the diameter
    const gridSize = radius * 2 + 1
    // Determine center point coordinates
    // center point coordinates would be just (radius, radius)

    const centerX = radius
    const centerY = radius

    // Create 2D array/grid filled with spaces
    const newGrid = new Grid({ width: gridSize, height: gridSize })
    const vertexArray = []

    // Calculate all vertex positions
    // Loop from 0 to sides-1

    for (let i = 0; i < sides; i += 1) {
      // Calculate angle for this vertex: (2 * PI * i) / sides
      const angle = (2 * Math.PI * i) / sides

      // Calculate vertex X: centerX + radius * cos(angle)
      const vertexX = Math.round(centerX + radius * Math.cos(angle))
      // Calculate vertex Y: centerY + radius * sin(angle)
      const vertexY = Math.round(centerY + radius * Math.sin(angle))
      // Store vertex in array
      vertexArray.push([vertexX, vertexY])
    }

    for (let i = 0; i < vertexArray.length - 1; i += 1) {
      newGrid.drawLine(vertexArray[i], vertexArray[i + 1], char)
    }
    // then connect the last one
    newGrid.drawLine(vertexArray[vertexArray.length - 1], vertexArray[0], char)

    if (filled) {
      this.fillPolygonInterior(newGrid, vertexArray, char)
    }
    return newGrid
  }

  /**
   * Fill polygon interior using scanline algorithm
   * @param {Grid} grid - Grid to fill
   * @param {Array} vertices - Polygon vertices [{row, col}, ...]
   * @param {string} char - Fill character
   */
  fillPolygonInterior(grid, vertices, char) {
    // For each row in grid
    for (let row = 0; row < grid.height; row++) {
      // Find all edge intersections at this row
      const intersections = []

      for (let i = 0; i < vertices.length; i++) {
        const v1 = vertices[i]
        const v2 = vertices[(i + 1) % vertices.length]

        // Check if edge crosses this row
        const minRow = Math.min(v1.row, v2.row)
        const maxRow = Math.max(v1.row, v2.row)

        if (row >= minRow && row <= maxRow && v1.row !== v2.row) {
          // Calculate intersection column
          const t = (row - v1.row) / (v2.row - v1.row)
          const col = Math.round(v1.col + t * (v2.col - v1.col))
          intersections.push(col)
        }
      }

      // Sort intersections
      intersections.sort((a, b) => a - b)

      // Fill between pairs of intersections
      for (let i = 0; i < intersections.length; i += 2) {
        if (i + 1 < intersections.length) {
          for (let col = intersections[i]; col <= intersections[i + 1]; col++) {
            grid.set(row, col, char)
          }
        }
      }
    }
  }

  /**
   * Generate a rectangle grid
   * @param {Object} options - Rectangle options
   * @param {number} options.width - Width of the rectangle
   * @param {number} options.height - Height of the rectangle
   * @param {string} [options.char='*'] - Character to use for drawing
   * @param {boolean} [options.filled=false] - Whether the rectangle should be filled
   * @returns {Grid} New grid instance with the rectangle drawn
   */
  static generateRectangle({ width, height, char = '*', filled = false }) {
    // create new grid class
    const newGrid = new Grid({ width, height })

    for (let i = 0; i < height; i += 1) {
      // If it's the first or last row, fully fill the array
      if (i === 0 || i === height - 1) {
        newGrid.setRow(i, char)
      } else {
        if (filled) {
          newGrid.setRow(i, char)
        } else {
          newGrid.setRow(i, ' ')
          // Assign the first and last to characters, rest will stay empty
          newGrid.set(i, 0, char)
          newGrid.set(i, width - 1, char)
        }
      }
    }

    return newGrid
  }

  /**
   * Create a text grid from a string
   * @param {Object} options - Text options
   * @param {string} options.text - Text string to render (A-Z, 0-9)
   * @returns {Grid} New grid instance with the text drawn
   */
  static createText({ text }) {
    // turn text in array
    // validate proper regex text in validator
    const textArray = text.split('')
    const charMapArray = []
    const gridCharMap = getGridCharMap()

    for (let i = 0; i < textArray.length; i += 1) {
      charMapArray.push(gridCharMap[textArray[i]])
    }
    // init first char as grid
    let [textGrid] = charMapArray
    for (let i = 1; i < textArray.length; i += 1) {
      textGrid = textGrid.rightAppend(charMapArray[i])
    }

    return textGrid
  }

  /**
   * Apply a single transformation to a grid
   * @param {Grid} grid - The grid to transform
   * @param {Object} transform - The transformation to apply
   * @param {string} transform.type - Type of transformation ('rotate', 'mirror', 'scale')
   * @param {Object} transform.params - Parameters for the transformation
   * @returns {Grid} The transformed grid
   * @static
   */
  static applyTransformation(grid, transform) {
    const { type, params } = transform

    switch (type) {
      case 'rotate':
        return grid.rotate(params.degrees)

      case 'mirror':
        return grid.mirror(params.axis)

      case 'scale':
        return grid.scale(params.factor)

      default:
        throw new Error(`Unknown transformation type: ${type}`)
    }
  }

  /**
   * Initialize grid from a string content (lines separated by newlines)
   * @param {string} content - String content with newlines separating rows
   * @private
   */
  initFromString(content) {
    // Split content by newlines to get rows
    const lines = content.split('\n')

    // Determine height from number of lines
    this.height = lines.length

    // Determine width from longest line
    this.width = Math.max(...lines.map(line => line.length))

    // Initialize grid
    this.grid = []

    // Fill grid with characters from content
    for (let y = 0; y < this.height; y++) {
      const row = []
      const line = lines[y] || ''

      for (let x = 0; x < this.width; x++) {
        // Use character from line if it exists, otherwise use space
        row.push(line[x] || ' ')
      }

      this.grid.push(row)
    }
  }

  /**
   * Set a character at the specified position
   * @param {number} row - The row coordinate (vertical position)
   * @param {number} col - The column coordinate (horizontal position)
   * @param {string} char - The character to set
   */
  set(row, col, char) {
    // Check if coordinates are within grid bounds
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      // Set character at position [row][col]
      this.grid[row][col] = char
      this.emit('cellUpdated', { row, col, char })
    }
  }
  /**
   * Set an entire row to a specific character
   * @param {number} row - The row index to set
   * @param {string} char - The character to fill the row with
   */
  setRow(row, char) {
    // check if in the grid bounds
    if (row >= 0 && row < this.height) {
      const fillArr = new Array(this.width).fill(char)
      // reset original 2d array by setting length
      this.grid[row].length = 0
      this.grid[row].push(...fillArr)
    }
  }

  /**
   * Check if a row exists in the grid
   * @param {number} row - The row index to check
   * @returns {boolean} True if the row exists, false otherwise
   */
  hasRow(row) {
    return !!this.grid[row]
  }

  /**
   * Get a row as a string
   * @param {number} row - The row index
   * @returns {string} The row as a joined string
   */
  getRowStr(row) {
    return this.grid[row].join('')
  }

  /**
   * Stream rows sequentially via events (v1 post-process approach)
   * Emits 'rowCompleted' for each row, then 'complete' when done
   * This is a first-pass implementation that emits all rows after grid is built
   */
  streamRowsV1() {
    for (let row = 0; row < this.height; row++) {
      this.emit('rowCompleted', {
        rowIndex: row,
        data: this.getRowStr(row),
        total: this.height,
      })
    }
    this.emit('complete', { total: this.height })
  }

  /**
   * Stream rows with delay for visual effect (async version)
   * @param {number} delayMs - Delay in milliseconds between rows (default 50ms)
   */
  async streamRowsWithDelay(delayMs = 50) {
    for (let row = 0; row < this.height; row++) {
      this.emit('rowCompleted', {
        rowIndex: row,
        data: this.getRowStr(row),
        total: this.height,
      })
      // Add delay between rows for animation effect
      if (row < this.height - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    this.emit('complete', { total: this.height })
  }

  /**
   * Stream rows with delay for visual effect (async version)
   * @param {number} delayMs - Delay in milliseconds between rows (default 50ms)
   */
  async streamTransformedRowsWithDelay(delayMs = 50) {
    for (let row = 0; row < this.height; row++) {
      this.emit('rowCompleted', {
        rowIndex: row,
        data: this.getRowStr(row),
        total: this.height,
      })
      // Add delay between rows for animation effect
      if (row < this.height - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    this.emit('complete', { total: this.height })
  }

  /**
   * Create a new grid by appending another grid horizontally
   * @param {Grid} gridToAppend - The grid to append to the right
   * @returns {Grid} New grid with both grids side by side
   */
  rightAppend(gridToAppend) {
    // Convert both grids to string arrays (split by lines)
    const thisRows = this.toString().split('\n')
    const appendRows = gridToAppend.toString().split('\n')

    // Zip them together with a space between
    const mergedRows = _.zipWith(thisRows, appendRows, (a, b) => `${a} ${b}`)

    // Join back into a single string and create new Grid
    return new Grid({ content: mergedRows.join('\n') })
  }

  /**
   * Create a new grid by appending another grid vertically above this one
   * @param {Grid} gridToAppend - The grid to append above
   * @returns {Grid} New grid with gridToAppend on top, this grid on bottom
   */
  topAppend(gridToAppend) {
    // Determine new dimensions (max width, sum of heights)
    const newWidth = Math.max(this.width, gridToAppend.width)

    // Helper to pad a line to target width
    const padLine = (line, targetWidth) => {
      return line.padEnd(targetWidth, ' ')
    }

    // Get content from both grids
    const topContent = gridToAppend.toString()
    const bottomContent = this.toString()

    // Split into lines and pad to match width
    const topLines = topContent.split('\n').map(line => padLine(line, newWidth))
    const bottomLines = bottomContent.split('\n').map(line => padLine(line, newWidth))

    // Combine top grid above bottom grid
    const combined = [...topLines, ...bottomLines].join('\n')
    return new Grid({ content: combined })
  }

  /**
   * Create a new grid by appending another grid vertically below this one
   * @param {Grid} gridToAppend - The grid to append below
   * @returns {Grid} New grid with this grid on top, gridToAppend on bottom
   */
  bottomAppend(gridToAppend) {
    // Determine new dimensions (max width, sum of heights)
    const newWidth = Math.max(this.width, gridToAppend.width)

    // Helper to pad a line to target width
    const padLine = (line, targetWidth) => {
      return line.padEnd(targetWidth, ' ')
    }

    // Get content from both grids
    const topContent = this.toString()
    const bottomContent = gridToAppend.toString()

    // Split into lines and pad to match width
    const topLines = topContent.split('\n').map(line => padLine(line, newWidth))
    const bottomLines = bottomContent.split('\n').map(line => padLine(line, newWidth))

    // Combine this grid above the appended grid
    const combined = [...topLines, ...bottomLines].join('\n')
    return new Grid({ content: combined })
  }

  /**
   * Center a grid horizontally within a target width
   * @param {number} targetWidth - Desired width
   * @returns {Grid} New centered grid
   */
  centerHorizontally(targetWidth) {
    if (targetWidth <= this.width) {
      return this // Already wider or equal, return as is
    }

    const leftPadding = Math.floor((targetWidth - this.width) / 2)
    const rightPadding = targetWidth - this.width - leftPadding

    const lines = this.toString().split('\n')

    const centeredLines = lines.map(line => {
      return ' '.repeat(leftPadding) + line + ' '.repeat(rightPadding)
    })

    return new Grid({ content: centeredLines.join('\n') })
  }

  /**
   * Draw a line between two points using linear interpolation
   * @param {Array<number>} start - Starting point [col, row]
   * @param {Array<number>} end - Ending point [col, row]
   * @param {string} [char='*'] - Character to use for drawing
   * @private
   */
  drawLine(start, end, char = '*') {
    // start and end are [x, y] coordinates from the polygon vertices
    const [startCol, startRow] = start
    const [endCol, endRow] = end
    const startColNum = Math.round(startCol)
    const startRowNum = Math.round(startRow)
    const endColNum = Math.round(endCol)
    const endRowNum = Math.round(endRow)

    // Calculate number of steps needed (max of deltaCol and deltaRow)
    const maxSteps = Math.max(
      Math.abs(endRowNum - startRowNum),
      Math.abs(endColNum - startColNum)
    )

    // Handle edge case: if steps is 0, just draw single point
    if (maxSteps === 0) {
      return
    }

    // Calculate increment per step for col and row
    const colIncrement = (endColNum - startColNum) / maxSteps
    const rowIncrement = (endRowNum - startRowNum) / maxSteps

    // Initialize current position to start point
    let currCol = startColNum
    let currRow = startRowNum

    for (let i = 0; i <= maxSteps; i += 1) {
      const roundedCol = Math.round(currCol)
      const roundedRow = Math.round(currRow)

      // Only set if within grid bounds (grid[row][col])
      if (
        this.hasRow(roundedRow) &&
        this.get(roundedRow, roundedCol) !== undefined
      ) {
        this.set(roundedRow, roundedCol, char)
      }

      currCol += colIncrement
      currRow += rowIncrement
    }
  }

  /**
   * Get the character at the specified position
   * @param {number} row - The row coordinate (vertical position)
   * @param {number} col - The column coordinate (horizontal position)
   * @returns {string} The character at the position
   */
  get(row, col) {
    // Check if coordinates are within grid bounds
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      // Return character at position [row][col]
      return this.grid[row][col]
    }
    // Return null if out of bounds
    return null
  }

  /**
   * Convert the grid to a 2D array
   * @returns {Array<Array<string>>} The grid as a 2D array
   */
  toArray() {
    // Return a deep copy of the grid array
    return this.grid.map(row => [...row])
  }

  /**
   * Convert the grid to a string representation
   * @returns {string} The grid as a string with rows separated by newlines
   */
  toString() {
    // Join each row into a string, then join all rows with newlines
    return this.grid.map(row => row.join('')).join('\n')
  }

  static allowed_degrees = [90, 180, 270]

  /**
   * Rotate the grid by specified degrees clockwise
   * @param {number} degrees - Degrees to rotate (90, 180, or 270)
   * @returns {Grid} New rotated grid instance
   */
  rotate(degrees) {
    if (!Grid.allowed_degrees.includes(degrees)) {
      throw new Error('Improper degree amount specified')
    }

    if (degrees === 90) {
      const newGrid = new Grid({ width: this.height, height: this.width })
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          // 90 degrees clockwise: new_row = col, new_col = height - 1 - row
          newGrid.set(col, this.height - 1 - row, this.get(row, col))
        }
      }
      return newGrid
    }

    if (degrees === 180) {
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          // 180 degrees: new_row = height - 1 - row, new_col = width - 1 - col
          newGrid.set(
            this.height - 1 - row,
            this.width - 1 - col,
            this.get(row, col)
          )
        }
      }
      return newGrid
    }

    if (degrees === 270) {
      const newGrid = new Grid({ width: this.height, height: this.width })
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          // 270 degrees clockwise: new_row = width - 1 - col, new_col = row
          newGrid.set(this.width - 1 - col, row, this.get(row, col))
        }
      }
      return newGrid
    }
  }

  static allowed_axis = ['horizontal', 'vertical']

  /**
   * Mirror the grid along specified axis
   * @param {string} axis - Axis to mirror along ('horizontal' or 'vertical')
   * @returns {Grid} New mirrored grid instance
   */
  mirror(axis) {
    if (!Grid.allowed_axis.includes(axis)) {
      throw new Error('Axis not allowed - can only be vertical or horizontal')
    }

    if (axis === 'vertical') {
      // Vertical flip: flip upside down
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          // new_row = height - 1 - row, new_col = col
          newGrid.set(this.height - 1 - row, col, this.get(row, col))
        }
      }
      return newGrid
    }

    if (axis === 'horizontal') {
      // Horizontal flip: flip left to right
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          // new_row = row, new_col = width - 1 - col
          newGrid.set(row, this.width - 1 - col, this.get(row, col))
        }
      }
      return newGrid
    }
  }
  static allowed_factor = [0.5, 2.0]

  /**
   * Scale the grid by specified factor
   * @param {number} factor - Scale factor (0.5 to shrink, 2.0 to enlarge)
   * @returns {Grid} New scaled grid instance
   */
  scale(factor) {
    if (!Grid.allowed_factor.includes(factor)) {
      throw new Error('factor to scale is not included in here')
    }

    if (factor === 2) {
      // Scale up: each cell becomes a 2x2 block
      const newGrid = new Grid({
        width: this.width * 2,
        height: this.height * 2,
      })

      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          const char = this.get(row, col)
          const newRow = row * 2
          const newCol = col * 2

          // Set all 4 cells in the 2x2 block
          newGrid.set(newRow, newCol, char)
          newGrid.set(newRow, newCol + 1, char)
          newGrid.set(newRow + 1, newCol, char)
          newGrid.set(newRow + 1, newCol + 1, char)
        }
      }
      return newGrid
    }

    if (factor === 0.5) {
      // Scale down: sample every other cell
      const newWidth = Math.ceil(this.width / 2)
      const newHeight = Math.ceil(this.height / 2)
      const newGrid = new Grid({ width: newWidth, height: newHeight })

      for (let row = 0; row < this.height; row += 2) {
        for (let col = 0; col < this.width; col += 2) {
          const char = this.get(row, col)
          newGrid.set(row / 2, col / 2, char)
        }
      }
      return newGrid
    }
  }

  /**
   * Overlay another grid on top of this grid at specified position
   * @param {Grid} sourceGrid - The grid to overlay
   * @param {Object} options - Placement options
   * @param {number} options.row - Row offset for placement
   * @param {number} options.col - Column offset for placement
   * @param {string} [options.char] - Optional char to override source chars
   * @param {boolean} [options.transparent=true] - If true, skip spaces from source
   * @returns {Grid} this (for chaining)
   */
  overlay(sourceGrid, { row, col, char = '*', transparent = true }) {
    // loop through source grid dimensions
    for (let srcRow = 0; srcRow < sourceGrid.height; srcRow++) {
      for (let srcCol = 0; srcCol < sourceGrid.width; srcCol++) {
        // calculate target position in grid
        const targetRow = srcRow + row
        const targetCol = srcCol + col

        // get character from source grid
        const sourceChar = sourceGrid.get(srcRow, srcCol)

        // skip if target is out of bounds
        if (this.get(targetRow, targetCol) === null) {
          continue
        }

        // if transparent mode, skip spaces from source
        if (transparent && sourceChar === ' ') {
          continue
        }

        // set character (use custom char if provided, otherwise use source char)
        const charToPlace = char || sourceChar
        this.set(targetRow, targetCol, charToPlace)
      }
    }
    return this // to enable chaining
  }

  /**
   * Alias for overlay() - more semantic for positioning
   * allows for us to use the static methods and chain things together
   * @param {Grid} grid - Grid to place
   * @param {Object} position - Position options
   * @returns {Grid} this (for chaining)
   */
  placeAt(grid, position) {
    return this.overlay(grid, position)
  }

  /**
   * Clip/crop the grid to a specific region
   * @param {Object} bounds - Clipping bounds
   * @param {number} bounds.startRow - Starting row (inclusive)
   * @param {number} bounds.endRow - Ending row (exclusive)
   * @param {number} bounds.startCol - Starting column (inclusive)
   * @param {number} bounds.endCol - Ending column (exclusive)
   * @returns {Grid} New clipped grid
   */
  clip({ startRow, endRow, startCol, endCol }) {
    // Validate and clamp bounds
    // to validate, we grab
    const bStartRow = Math.max(startRow, 0)
    const bEndRow = Math.min(endRow, this.height)
    const bStartCol = Math.max(startCol, 0)
    const bEndCol = Math.min(endCol, this.width)
    // Calculate new dimensions
    // since beginning is inclusive
    // end row 4, start row 2, that means we only do 2 and 3
    const newHeight = bEndRow - bStartRow
    const newWidth = bEndCol - bStartCol
    const clippedGrid = new Grid({ width: newWidth, height: newHeight })
    // Create new grid
    // Copy region
    for (let row = bStartRow; row < bEndRow; row++) {
      for (let col = bStartCol; col < bEndCol; col++) {
        // in case we are out of bounds on original, we will set it to blank on clipped
        clippedGrid.set(
          row - bStartRow,
          col - bStartCol,
          this.get(row, col) || ' '
        )
      }
    }
    return clippedGrid
  }

  /**
   * Get the bounding box dimensions of the grid
   * @returns {Object} Object with width and height properties
   */
  getBounds() {
    return {
      width: this.width,
      height: this.height,
    }
  }

  /**
   * Get the center point coordinates of the grid
   * @returns {Object} Object with row and col properties (floored)
   */
  getCenterPoint() {
    return {
      row: Math.floor(this.height / 2),
      col: Math.floor(this.width / 2),
    }
  }

  /**
   * Get the actual content bounds (non-space characters)
   * @returns {Object} { minRow, maxRow, minCol, maxCol, width, height }
   */
  getContentBounds() {
    let minRow = this.height
    let maxRow = -1
    let minCol = this.width
    let maxCol = -1

    // iterate through the grid
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        // find the character at that space
        const charAtSpace = this.get(row, col)
        // if the character is a non-space character
        if (charAtSpace !== ' ') {
          minRow = Math.min(minRow, row)
          maxRow = Math.max(maxRow, row)
          minCol = Math.min(minCol, col)
          maxCol = Math.max(maxCol, col)
        }
      }
    }
    return {
      minRow,
      maxRow,
      minCol,
      maxCol,
      width: this.width,
      height: this.height,
    }
  }
}

export default Grid
