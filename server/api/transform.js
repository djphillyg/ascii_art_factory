import Grid from '../../cli/grid.js'

export const transform = (req, res) => {
  const { shape, transformation } = req.body

  const grid = new Grid({ content: shape })

  // Apply transformation using Grid.applyTransformation (same as WebSocket handler)
  const transformedGrid = Grid.applyTransformation(grid, transformation)

  return res.json({ output: transformedGrid.render() })
}
