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
  fontWeight = terminalTheme.fontWeights.standard,
  ...props
}) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label
        color={color}
        fontSize={terminalTheme.fontSizes.label}
        fontWeight={fontWeight}
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
        fontWeight={fontWeight}
        paddingLeft={terminalTheme.spacing.inputPadding}
        paddingRight={terminalTheme.spacing.inputPadding}
        {...terminalTheme.inputStyles}
        {...props}
      />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {!error && helperText && (
        <Field.HelperText
          color={color}
          fontSize={terminalTheme.fontSizes.helper}
          fontWeight={fontWeight}
        >
          {helperText}
        </Field.HelperText>
      )}
    </Field.Root>
  )
}