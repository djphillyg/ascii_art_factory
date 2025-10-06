import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentShapeType, selectOptions } from '../shapeGeneratorSlice'
import { shapeValidationRules } from './shapeValidationRules'

/**
 * Custom hook for validating shape options
 *
 * Returns:
 * - isValid: boolean - true if all validations pass
 * - errors: object - field names mapped to error messages
 *
 * Usage:
 * const { isValid, errors } = useShapeValidation()
 *
 * In inputs: error={errors.radius}
 * In button: disabled={!isValid}
 */
export function useShapeValidation() {
  const shapeType = useSelector(selectCurrentShapeType)
  const options = useSelector(selectOptions)

  const { isValid, errors } = useMemo(() => {
    // No shape selected = not valid
    if (!shapeType) {
      return { isValid: false, errors: {} }
    }

    const errors = {}
    const shapeRules = shapeValidationRules[shapeType] || {}
    const sharedRules = shapeValidationRules.shared || {}

    // Validate shape-specific required fields
    Object.entries(shapeRules).forEach(([field, rules]) => {
      const value = options[field]

      // Custom validation function takes precedence
      if (rules.customValidate) {
        const error = rules.customValidate(value)
        if (error) {
          errors[field] = error
          return
        }
      }

      // Required field validation
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors[field] = rules.message || `${field} is required`
        return
      }

      // Skip other validations if field is empty and not required
      if (!value && !rules.required) {
        return
      }

      // Min value validation
      if (rules.min !== undefined && value < rules.min) {
        errors[field] = rules.message || `${field} must be at least ${rules.min}`
        return
      }

      // Max value validation
      if (rules.max !== undefined && value > rules.max) {
        errors[field] = rules.message || `${field} must be at most ${rules.max}`
        return
      }

      // Pattern validation (regex)
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || `${field} format is invalid`
        return
      }

      // Options validation (must be one of allowed values)
      if (rules.options && !rules.options.includes(value)) {
        errors[field] = rules.message || `${field} must be one of: ${rules.options.join(', ')}`
        return
      }

      // Min length validation
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors[field] = rules.message || `${field} must be at least ${rules.minLength} characters`
        return
      }
    })

    // Validate shared optional fields
    Object.entries(sharedRules).forEach(([field, rules]) => {
      const value = options[field]

      // Check if field is conditionally required
      if (rules.requiredWhen && rules.requiredWhen(options, shapeType)) {
        if (value === undefined || value === null || value === '') {
          errors[field] = rules.message || `${field} is required`
          return
        }

        // If required and present, validate constraints
        if (rules.min !== undefined && value < rules.min) {
          errors[field] = rules.message || `${field} must be at least ${rules.min}`
          return
        }

        if (rules.max !== undefined && value > rules.max) {
          errors[field] = rules.message || `${field} must be at most ${rules.max}`
          return
        }

        if (rules.options && !rules.options.includes(value)) {
          errors[field] = rules.message || `${field} must be one of: ${rules.options.join(', ')}`
          return
        }
      }

      // If field has value but isn't required, still validate constraints
      if (value && !rules.requiredWhen) {
        if (rules.options && !rules.options.includes(value)) {
          errors[field] = rules.message || `${field} must be one of: ${rules.options.join(', ')}`
          return
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }, [shapeType, options])

  return { isValid, errors }
}