import Grid from './grid.js'
export default class CompositeGrid extends Grid {
  constructor({ width, height, content }) {
    super({ width, height, content })
    this.layers = [] // track composition history
  }

  /**
   * Add a shape with automatic centering
   * @param {Grid} grid - Grid to add
   * @param {Object} options - Placement options
   * @param {string} [options.anchor='center'] - 'center', 'topLeft', 'bottomRight', etc.
   * @param {number} [options.offsetRow=0] - Row offset from anchor
   * @param {number} [options.offsetCol=0] - Column offset from anchor
   * @param {string} [options.char] - Optional char override
   */
  addShape(
    grid,
    { anchor = 'center', offsetRow = 0, offsetCol = 0, char = null } = {}
  ) {
    let targetRow, targetCol

    // calculate position based on anchor
    if (anchor === 'center') {
      const centerThis = this.getCenterPoint()
      const centerGrid = grid.getCenterPoint()
      targetRow = centerThis.row - centerGrid.row + offsetRow
      targetCol = centerThis.col - centerGrid.col + offsetCol
    } else if (anchor === 'topLeft') {
      targetRow = offsetRow
      targetCol = offsetCol
    } else if (anchor === 'topRight') {
      targetRow = offsetRow
      targetCol = this.width - grid.width - offsetCol
    } else if (anchor === 'bottomLeft') {
      targetRow = this.height - grid.height - offsetRow
      targetCol = offsetCol
    } else if (anchor === 'bottomRight') {
      targetRow = this.height - grid.height - offsetRow
      targetCol = this.width - grid.width - offsetCol
    }

    // overlay the shape
    this.overlay(grid, { row: targetRow, col: targetCol, char })
    // track for debugging

    this.layers.push({ grid, anchor, offsetRow, offsetCol, char })
    return this
  }

  static fromRecipe(recipe) {
    const { width, height, shapes } = recipe
    const composite = new CompositeGrid({ width, height })

    // apply each shape in the recipe
    shapes.forEach(({ type, params, placement }) => {
      let shape
      // generate shape based on type
      // Generate shape based on type
      switch (type) {
        case 'circle':
          shape = Grid.generateCircle(params)
          break
        case 'rectangle':
          shape = Grid.generateRectangle(params)
          break
        case 'polygon':
          shape = Grid.generatePolygon(params)
          break
        case 'text':
          shape = Grid.createText(params)
          break
      }

      // Add to composite
      if (shape) {
        composite.addShape(shape, placement)
      }
    })
    return composite
  }
}
