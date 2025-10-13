import Joi from 'joi'

// Schema for shape parameters based on shape type
const circleParamsSchema = Joi.object({
  radius: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'radius must be at least 1',
      'any.required': 'radius is required for circle'
    }),
  filled: Joi.boolean().required(),
  char: Joi.string().length(1).default('*')
})

const rectangleParamsSchema = Joi.object({
  width: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'width must be at least 1',
      'any.required': 'width is required for rectangle'
    }),
  height: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'height must be at least 1',
      'any.required': 'height is required for rectangle'
    }),
  filled: Joi.boolean().required(),
  char: Joi.string().length(1).default('*')
})

const polygonParamsSchema = Joi.object({
  sides: Joi.number().integer().min(3).required()
    .messages({
      'number.min': 'sides must be at least 3',
      'any.required': 'sides is required for polygon'
    }),
  radius: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'radius must be at least 1',
      'any.required': 'radius is required for polygon'
    }),
  filled: Joi.boolean().required(),
  char: Joi.string().length(1).default('*')
})

const textParamsSchema = Joi.object({
  text: Joi.string().pattern(/^[A-Z0-9]+$/).required()
    .messages({
      'string.pattern.base': 'text must contain only A-Z and 0-9',
      'any.required': 'text is required for text shape'
    })
})

// Schema for transformation params
const transformParamsSchema = Joi.object({
  degrees: Joi.number().valid(90, 180, 270).when('type', {
    is: 'rotate',
    then: Joi.required()
  }),
  axis: Joi.string().valid('horizontal', 'vertical').when('type', {
    is: 'mirror',
    then: Joi.required()
  }),
  factor: Joi.number().valid(0.5, 2.0).when('type', {
    is: 'scale',
    then: Joi.required()
  })
})

// Schema for bounds (clip operation)
const boundsSchema = Joi.object({
  startRow: Joi.number().integer().min(0).required(),
  endRow: Joi.number().integer().min(0).required(),
  startCol: Joi.number().integer().min(0).required(),
  endCol: Joi.number().integer().min(0).required()
})

// Schema for position (overlay operation)
const positionSchema = Joi.object({
  row: Joi.number().integer().required(),
  col: Joi.number().integer().required()
})

// Base operation schema
const baseOperationSchema = Joi.object({
  operation: Joi.string()
    .valid('generate', 'overlay', 'topAppend', 'bottomAppend', 'centerHorizontally', 'clip', 'transform')
    .required()
    .messages({
      'any.only': 'operation must be one of: generate, overlay, topAppend, bottomAppend, centerHorizontally, clip, transform',
      'any.required': 'operation is required'
    })
})

// Generate operation
const generateOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('generate').required(),
  shape: Joi.string().valid('circle', 'rectangle', 'polygon', 'text').required()
    .messages({
      'any.only': 'shape must be one of: circle, rectangle, polygon, text',
      'any.required': 'shape is required for generate operation'
    }),
  params: Joi.object().required(),
  storeAs: Joi.string().min(1).required()
    .messages({
      'string.empty': 'storeAs cannot be empty',
      'any.required': 'storeAs is required for generate operation'
    })
}).custom((value, helpers) => {
  const { shape, params } = value

  // Validate params based on shape type
  let paramsSchema
  switch (shape) {
    case 'circle':
      paramsSchema = circleParamsSchema
      break
    case 'rectangle':
      paramsSchema = rectangleParamsSchema
      break
    case 'polygon':
      paramsSchema = polygonParamsSchema
      break
    case 'text':
      paramsSchema = textParamsSchema
      break
  }

  const { error } = paramsSchema.validate(params)
  if (error) {
    return helpers.message(`Invalid params for ${shape}: ${error.message}`)
  }

  return value
})

// Overlay operation
const overlayOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('overlay').required(),
  target: Joi.string().min(1).required()
    .messages({
      'string.empty': 'target cannot be empty',
      'any.required': 'target is required for overlay operation'
    }),
  source: Joi.string().min(1).required()
    .messages({
      'string.empty': 'source cannot be empty',
      'any.required': 'source is required for overlay operation'
    }),
  position: positionSchema.required()
    .messages({
      'any.required': 'position is required for overlay operation'
    }),
  transparent: Joi.boolean().default(true)
})

// TopAppend operation
const topAppendOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('topAppend').required(),
  target: Joi.string().min(1).required()
    .messages({
      'string.empty': 'target cannot be empty',
      'any.required': 'target (bottom grid) is required for topAppend operation'
    }),
  source: Joi.string().min(1).required()
    .messages({
      'string.empty': 'source cannot be empty',
      'any.required': 'source (top grid) is required for topAppend operation'
    }),
  storeAs: Joi.string().min(1).required()
    .messages({
      'string.empty': 'storeAs cannot be empty',
      'any.required': 'storeAs is required for topAppend operation'
    })
})

// BottomAppend operation
const bottomAppendOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('bottomAppend').required(),
  target: Joi.string().min(1).required()
    .messages({
      'string.empty': 'target cannot be empty',
      'any.required': 'target (top grid) is required for bottomAppend operation'
    }),
  source: Joi.string().min(1).required()
    .messages({
      'string.empty': 'source cannot be empty',
      'any.required': 'source (bottom grid) is required for bottomAppend operation'
    }),
  storeAs: Joi.string().min(1).required()
    .messages({
      'string.empty': 'storeAs cannot be empty',
      'any.required': 'storeAs is required for bottomAppend operation'
    })
})

// CenterHorizontally operation
const centerHorizontallyOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('centerHorizontally').required(),
  source: Joi.string().min(1).required()
    .messages({
      'string.empty': 'source cannot be empty',
      'any.required': 'source is required for centerHorizontally operation'
    }),
  targetWidth: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'targetWidth must be at least 1',
      'any.required': 'targetWidth is required for centerHorizontally operation'
    }),
  storeAs: Joi.string().min(1).required()
    .messages({
      'string.empty': 'storeAs cannot be empty',
      'any.required': 'storeAs is required for centerHorizontally operation'
    })
})

// Clip operation
const clipOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('clip').required(),
  source: Joi.string().min(1).required()
    .messages({
      'string.empty': 'source cannot be empty',
      'any.required': 'source is required for clip operation'
    }),
  bounds: boundsSchema.required()
    .messages({
      'any.required': 'bounds is required for clip operation'
    }),
  storeAs: Joi.string().min(1).required()
    .messages({
      'string.empty': 'storeAs cannot be empty',
      'any.required': 'storeAs is required for clip operation'
    })
})

// Transform operation
const transformOperationSchema = baseOperationSchema.append({
  operation: Joi.string().valid('transform').required(),
  source: Joi.string().min(1).required()
    .messages({
      'string.empty': 'source cannot be empty',
      'any.required': 'source is required for transform operation'
    }),
  type: Joi.string().valid('rotate', 'mirror', 'scale').required()
    .messages({
      'any.only': 'type must be one of: rotate, mirror, scale',
      'any.required': 'type is required for transform operation'
    }),
  params: transformParamsSchema.required()
    .messages({
      'any.required': 'params is required for transform operation'
    }),
  storeAs: Joi.string().min(1).required()
    .messages({
      'string.empty': 'storeAs cannot be empty',
      'any.required': 'storeAs is required for transform operation'
    })
})

// Combined operation schema that validates based on operation type
const operationSchema = Joi.alternatives()
  .try(
    generateOperationSchema,
    overlayOperationSchema,
    topAppendOperationSchema,
    bottomAppendOperationSchema,
    centerHorizontallyOperationSchema,
    clipOperationSchema,
    transformOperationSchema
  )
  .messages({
    'alternatives.match': 'Operation does not match any valid operation schema'
  })

// Main recipe schema
export const recipeSchema = Joi.object({
  recipe: Joi.array()
    .items(operationSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'recipe must contain at least one operation',
      'any.required': 'recipe array is required'
    }),
  output: Joi.string().min(1).required()
    .messages({
      'string.empty': 'output cannot be empty',
      'any.required': 'output is required - must reference a stored grid variable'
    })
})