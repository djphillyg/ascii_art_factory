/* eslint-disable */
import OutputSerializer from "../../cli/serializer"

export const generate = (req, res) => {
    const { type, options } = req.body
    const grid = generate(type, options)
    const serializer = new OutputSerializer(grid, { type, options })
    return res.json(serializer.toJSON())
}