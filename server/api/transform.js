import Transformer from '../../cli/transformer.js'
import Grid from '../../cli/grid.js'

export const transform = (req, res) => {
    const { shape, transformation } = req.body

    const grid = new Grid({ content: shape })

    // apply single transformation
    const {output: stringOutput } = Transformer.transform({
        grid,
        transformations: [transformation]
    })

    return res.json({ output: stringOutput })
}
