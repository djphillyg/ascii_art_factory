import { Input, Field } from '@chakra-ui/react'
import { terminalTheme } from '../../../theme/terminal'

/**
 * Reusable TextInput component
 * Wraps Chakra UI Input with Field for consistent styling
 */
export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
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
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        color={color}
        _placeholder={{ color }}
        fontSize={terminalTheme.fontSizes.input}
        paddingLeft={terminalTheme.spacing.inputPadding}
        paddingRight={terminalTheme.spacing.inputPadding}
        {...props}
      />
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