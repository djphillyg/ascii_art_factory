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

  /*** SHAPES ****************/
  /**
   * generate circle - statically generates a circle
   * @param {*} param0
   * @returns a new grid class instance with the circle filled in
   */
  static generateCircle({ radius, filled }) {
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
          newGrid.set(row, col, '*')
        }

        if (filled && diff < 0) {
          newGrid.set(row, col, '*')
        }
      }
    }

    newGrid.streamRowsV1()
    return newGrid
  }

  static generatePolygon({ sides, radius }) {
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
      newGrid.drawLine(vertexArray[i], vertexArray[i + 1])
    }
    // then connect the last one
    newGrid.drawLine(vertexArray[vertexArray.length - 1], vertexArray[0])

    newGrid.streamRowsV1()
    return newGrid
  }

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

    newGrid.streamRowsV1()
    return newGrid
  }

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

    textGrid.streamRowsV1()
    return textGrid
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

  hasRow(row) {
    return !!this.grid[row]
  }

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

  // this function will create a new grid by appending another grid
  rightAppend(gridToAppend) {
    // Convert both grids to string arrays (split by lines)
    const thisRows = this.toString().split('\n')
    const appendRows = gridToAppend.toString().split('\n')

    // Zip them together with a space between
    const mergedRows = _.zipWith(thisRows, appendRows, (a, b) => `${a} ${b}`)

    // Join back into a single string and create new Grid
    return new Grid({ content: mergedRows.join('\n') })
  }

  drawLine(start, end) {
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
        this.set(roundedRow, roundedCol, '*')
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
   *
   * @param {*} degrees The degrees allowed for rotation (90, 180, 270)
   * this function will return a completely rotated new grid
   */
  rotate(degrees) {
    // check if the degrees are in the allowed range o
    if (!Grid.allowed_degrees.includes(degrees)) {
      throw new Error('Improper degree amount specified')
    }

    // it is the proper amount, so lets remember what each one would do
    /**
     * 90 degrees ->
     * newX = oldY
     * newY = width - 1 - oldX
     */
    if (degrees === 90) {
      const newGrid = new Grid({ width: this.height, height: this.width })
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          newGrid.set(y, this.width - 1 - x, this.get(x, y))
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }

    /**
     * 180 degrees -> neg x and then y
     * newX = width - 1 - oldX
     * newY = height - 1 - oldY
     */
    if (degrees === 180) {
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          newGrid.set(this.width - 1 - x, this.height - 1 - y, this.get(x, y))
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }
    // 270 degrees -> neg y and neg x
    /**
     * newX = height - 1 - oldY
     * newY = oldX
     */
    if (degrees === 270) {
      const newGrid = new Grid({ width: this.height, height: this.width })
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          newGrid.set(this.height - 1 - y, x, this.get(x, y))
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }
  }

  static allowed_axis = ['horizontal', 'vertical']

  /**
   *
   * @param {*} _axis
   */
  mirror(axis) {
    /**
     * implemnetation
     * - go through one side and just do the other
     * - horizontal, flipping on the x axis
     */
    if (!Grid.allowed_axis.includes(axis)) {
      throw new Error('Axis not allowed - can only be vertical or horizontal')
    }

    if (axis === 'vertical') {
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          /**
           * newY = (height - 1 - y)
           * newX = oldX
           */
          newGrid.set(x, this.height - 1 - y, this.get(x, y))
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }

    if (axis === 'horizontal') {
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          /**
           * newY = oldY
           * newX = (width - 1 - x)
           */
          newGrid.set(this.width - 1 - x, y, this.get(x, y))
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }
  }
  static allowed_factor = [0.5, 2.0]
  /**
   * right now, this only works on well-formed structures
   * @param {*} factor
   * @returns
   */
  scale(factor) {
    if (!Grid.allowed_factor.includes(factor)) {
      throw new Error('factor to scale is not included in here')
    }
    /**
     * blows everything up to a 2x2 grid if the scale is 2
     *
     * samples a pixel in the 2x2 grid and shrinks it down if it is 0.5
     */
    if (factor === 2) {
      // create a new grid 2x the size
      const newGrid = new Grid({
        width: this.width * 2,
        height: this.height * 2,
      })
      // iterate through the old grid
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          const xAnchor = x * 2
          const yAnchor = y * 2
          // for every single grid item, you must input 4 times now
          const newEntryPairs = [
            [xAnchor, yAnchor],
            [xAnchor + 1, yAnchor],
            [xAnchor, yAnchor + 1],
            [xAnchor + 1, yAnchor + 1],
          ]
          // and then go through and set them
          newEntryPairs.forEach(pair => {
            newGrid.set(pair[0], pair[1], this.get(x, y))
          })
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }
    if (factor === 0.5) {
      const newWidth = Math.ceil(this.width / 2)
      const newHeight = Math.ceil(this.height / 2)
      const newGrid = new Grid({ width: newWidth, height: newHeight })
      for (let x = 0; x < this.width; x += 2) {
        for (let y = 0; y < this.height; y += 2) {
          // we are merely going through the grid
          // assuming that it is a scaled 2x2 block and just
          // placing in the smaller grid
          newGrid.set(x / 2, y / 2, this.get(x, y))
        }
      }
      newGrid.streamRowsV1()
      return newGrid
    }
  }
}

export default Grid
