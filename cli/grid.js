/**
 * Grid class for managing a 2D character grid
 */
class Grid {
  /**
   * Create a new Grid
   * @param {Object} options - Grid configuration
   * @param {number} [options.width] - The width of the grid (required if content is empty)
   * @param {number} [options.height] - The height of the grid (required if content is empty)
   * @param {string} [options.content=''] - Optional string content to parse (newline-separated)
   */
  constructor({ width, height, content = ''}) {
    // If content is provided and not empty, initialize from string
    if (content && content.trim().length > 0) {
      this.initFromString(content)
    } else {
      // Normal constructor: width and height provided
      this.width = width
      this.height = height

      // Initialize 2D array filled with spaces
      this.grid = Array(height).fill(null).map(() => Array(width).fill(' '))
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
      if (this.hasRow(roundedRow) && this.get(roundedRow, roundedCol) !== undefined) {
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
      for (let x = 0; x < this.width; x ++) {
        for (let y = 0; y < this.height; y ++) {
          /**
           * newY = (height - 1 - y)
           * newX = oldX
           */
          newGrid.set(x, this.height - 1 - y, this.get(x, y))
        }
      }
      return newGrid
    }

    if (axis === 'horizontal') {
      const newGrid = new Grid({ width: this.width, height: this.height })
      for (let x = 0; x < this.width; x ++) {
        for (let y = 0; y < this.height; y ++) {
          /**
           * newY = oldY
           * newX = (width - 1 - x)
           */
          newGrid.set(this.width - 1 - x, y, this.get(x, y))
        }
      }
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
      const newGrid = new Grid({ width: this.width * 2, height: this.height * 2 })
      // iterate through the old grid 
      for (let x = 0; x < this.width; x ++ ) {
        for (let y = 0; y < this.height; y ++ ) {
          const xAnchor = x * 2
          const yAnchor = y * 2
          // for every single grid item, you must input 4 times now
          const newEntryPairs = [
            [xAnchor, yAnchor],
            [xAnchor + 1, yAnchor],
            [xAnchor, yAnchor + 1],
            [xAnchor + 1, yAnchor + 1]
          ]
          // and then go through and set them
          newEntryPairs.forEach(pair => {
            newGrid.set(pair[0], pair[1], this.get(x, y))
          })
        }
      }
      return newGrid
    }
    if (factor === 0.5) {
      const newWidth = Math.ceil(this.width/2)
      const newHeight = Math.ceil(this.height/2)
      const newGrid = new Grid({ width: newWidth, height: newHeight })
      for (let x = 0; x < this.width; x+=2) {
        for (let y = 0; y < this.height; y+=2) {
          // we are merely going through the grid
          // assuming that it is a scaled 2x2 block and just 
          // placing in the smaller grid
          newGrid.set(x/2, y/2, this.get(x, y))
        }
      }
      return newGrid
    }
  }
}

export default Grid