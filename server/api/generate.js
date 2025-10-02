import { generate as generateShape } from '../../cli/generator.js';
import { OutputSerializer } from '../../cli/serializer.js';


export const generate = (req, res) => {
    const { type, options } = req.body;
    const result = generateShape(type, options);
    const serializer = new OutputSerializer(result.grid, { type, options });
    return res.json(serializer.toJSON());
}