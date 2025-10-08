import Joi from 'joi'

// Schema for rotate transformation params
const rotateParamsSchema = Joi.object({
    degrees: Joi.number().valid(90, 180, 270).required()
        .messages({
            'any.only': 'degrees must be one of: 90, 180, 270',
            'any.required': 'degrees is required for rotate transformation'
        })
})

// Schema for mirror transformation params
const mirrorParamsSchema = Joi.object({
    axis: Joi.string().valid('horizontal', 'vertical').required()
        .messages({
            'any.only': 'axis must be one of: horizontal, vertical',
            'any.required': 'axis is required for mirror transformation'
        })
})

// Schema for scale transformation params
const scaleParamsSchema = Joi.object({
    factor: Joi.number().valid(0.5, 2).required()
        .messages({
            'any.only': 'factor must be one of: 0.5 (shrink), 2 (enlarge)',
            'any.required': 'factor is required for scale transformation'
        })
})

// Main transformation schema with conditional params validation
const transformationSchema = Joi.object({
    type: Joi.string().valid('rotate', 'mirror', 'scale').required()
        .messages({
            'any.only': 'type must be one of: rotate, mirror, scale',
            'any.required': 'transformation type is required'
        }),
    params: Joi.object().required()
        .messages({
            'any.required': 'params object is required for transformation'
        })
}).custom((value, helpers) => {
    const { type, params } = value

    // Validate params based on transformation type
    let paramsSchema
    switch (type) {
        case 'rotate':
            paramsSchema = rotateParamsSchema
            break
        case 'mirror':
            paramsSchema = mirrorParamsSchema
            break
        case 'scale':
            paramsSchema = scaleParamsSchema
            break
    }

    const { error } = paramsSchema.validate(params)
    if (error) {
        return helpers.message(error.message)
    }

    return value
})

// Main transform request schema
export const transformSchema = Joi.object({
    shape: Joi.string().min(1).required()
        .messages({
            'string.empty': 'shape cannot be empty',
            'any.required': 'shape is required'
        }),
    transformation: transformationSchema
})