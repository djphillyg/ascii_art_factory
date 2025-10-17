import Joi from 'joi'

export const generateSchema = Joi.object({
    type: Joi.string().valid('text', 'rectangle', 'circle', 'polygon').required(),
    options: Joi.object({
        width: Joi.number().integer().optional(),
        height: Joi.number().integer().optional(),
        radius: Joi.number().integer().optional(),
        sides: Joi.number().integer().optional(),
        text: Joi.string().optional(),
        filled: Joi.boolean().optional(),
        fillPattern: Joi.string().valid('dots', 'gradient', 'diagonal', 'crosshatch').optional(),
        direction: Joi.string().valid('vertical', 'horizontal').optional(),
        output: Joi.string().optional(),
        append: Joi.boolean().optional(),
    }).required()
}).custom((value, helpers) => {
    const { type, options } = value

    // rectangle validation
    if (type === 'rectangle') {
        if (!options.width || options.width <= 0) {
            return helpers.message('-- width is required and must be > 0 for rectangle')
        }

        if (!options.height || options.height <= 0) {
            return helpers.message('-- height is required and must be > 0 for rectangle')
        }
    }

    // circle/ polygon validation
    if (type === 'circle' || type === 'polygon') {
        if (!options.radius || options.radius <= 0) {
        return helpers.message('--radius is required and must be > 0 for circles/polygons');
      }
    }

    if (type === 'polygon') {
        if (!options.sides || options.sides <= 3) {
            return helpers.message('--sides is required and must be > 3 for polygons');
        }
    }

    // validity of fill pattern is checked, so just check the direction logic
    // if the fill pattern is gradient we need a direction

    if (options.fillPattern && options.fillPattern === 'gradient') {
        if (!options.direction) {
            return helpers.message('--direction must be provided when having a gradient fill')
        }
        if (!options.width || options.width <= 0 || !options.height || options.height <= 0) {
            return helpers.message('width and height required for gradient fill')
        }
    }

    // text validation
    if (type === 'text') {
        if (!options.text) {
            return helpers.message('--text is required for text banners')
        }
        if (!/^[A-Za-z0-9/\\ ^]+$/.test(options.text)) {
            return helpers.message('--text must contain only A-Z, a-z, 0-9, /, \\, space, and ^')
        }
    }

    return value
})