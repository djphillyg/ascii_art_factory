import { NativeSelect, Field } from '@chakra-ui/react'
import { terminalTheme } from '../../../theme/terminal'

/**
 * Reusable SelectInput component
 * Wraps Chakra UI NativeSelect with Field for consistent styling
 */
export default function SelectInput({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  helperText,
  error,
  color = terminalTheme.colors.text.primary,
  ...props
}) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label
        color={color}
        fontSize={terminalTheme.fontSizes.label}
      >
        {label}
      </Field.Label>
      <NativeSelect.Root {...props}>
        <NativeSelect.Field
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          color={color}
          _placeholder={{ color }}
          fontSize={terminalTheme.fontSizes.input}
          paddingLeft={terminalTheme.spacing.inputPadding}
          paddingRight={terminalTheme.spacing.inputPadding}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {!error && helperText && (
        <Field.HelperText
          color={color}
          fontSize={terminalTheme.fontSizes.helper}
        >
          {helperText}
        </Field.HelperText>
      )}
    </Field.Root>
  )
}