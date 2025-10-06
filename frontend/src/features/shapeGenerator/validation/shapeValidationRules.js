/**
 * Validation rules for shape generation
 *
 * Structure:
 * - Each shape type has its own required parameter rules
 * - Shared rules apply to all shapes (optional parameters)
 * - Rules can have: required, min, max, pattern, options, requiredWhen
 */

export const shapeValidationRules = {
  circle: {
    radius: {
      required: true,
      min: 1,
      max: 100,
      message: 'Radius must be between 1 and 100'
    }
  },

  rectangle: {
    width: {
      required: true,
      min: 1,
      max: 100,
      message: 'Width must be between 1 and 100'
    },
    height: {
      required: true,
      min: 1,
      max: 100,
      message: 'Height must be between 1 and 100'
    }
  },

  polygon: {
    radius: {
      required: true,
      min: 1,
      max: 100,
      message: 'Radius must be between 1 and 100'
    },
    sides: {
      required: true,
      min: 3,
      max: 100,
      message: 'Sides must be between 3 and 100'
    }
  },

  text: {
    text: {
      required: true,
      pattern: /^[A-Z0-9]+$/,
      message: 'Only uppercase letters (A-Z) and numbers (0-9) allowed',
      minLength: 1,
      customValidate: (value) => {
        if (!value || value.length === 0) {
          return 'Text is required'
        }
        if (!/^[A-Z0-9]+$/.test(value)) {
          return 'Only uppercase letters (A-Z) and numbers (0-9) allowed'
        }
        return null
      }
    }
  },

  // Shared optional parameters across all shapes
  shared: {
    fillPattern: {
      optional: true,
      options: ['dots', 'gradient', 'diagonal', 'crosshatch']
    },
    direction: {
      requiredWhen: (options) => options.fillPattern === 'gradient',
      options: ['horizontal', 'vertical'],
      message: 'Direction is required when using gradient pattern'
    },
    // For text shapes with gradient, width and height are required
    width: {
      requiredWhen: (options, shapeType) =>
        shapeType === 'text' && options.fillPattern === 'gradient',
      min: 1,
      max: 100,
      message: 'Width is required for gradient pattern (1-100)'
    },
    height: {
      requiredWhen: (options, shapeType) =>
        shapeType === 'text' && options.fillPattern === 'gradient',
      min: 1,
      max: 100,
      message: 'Height is required for gradient pattern (1-100)'
    }
  }
}