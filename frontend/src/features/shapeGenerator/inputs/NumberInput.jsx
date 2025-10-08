import { NumberInput as ChakraNumberInput, Field } from '@chakra-ui/react'
import { terminalTheme } from '../../../theme/terminal'

/**
 * Reusable NumberInput component
 * Wraps Chakra UI NumberInput with Field for consistent styling
 */
export default function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
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
      <ChakraNumberInput.Root
        value={value}
        onValueChange={(details) => onChange(Number(details.value))}
        min={min}
        max={max}
        {...props}
      >
        <ChakraNumberInput.Control />
        <ChakraNumberInput.Input
          color={color}
          _placeholder={{ color }}
          fontSize={terminalTheme.fontSizes.input}
          paddingLeft={terminalTheme.spacing.inputPadding}
          paddingRight={terminalTheme.spacing.inputPadding}
        />
      </ChakraNumberInput.Root>
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