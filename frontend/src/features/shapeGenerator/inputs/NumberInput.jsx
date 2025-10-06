import { NumberInput as ChakraNumberInput, Field } from '@chakra-ui/react'

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
  color = "rgb(240, 255, 255)",
  ...props
}) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <ChakraNumberInput.Root
        value={value}
        onValueChange={(details) => onChange(Number(details.value))}
        min={min}
        max={max}
        color={color}
        _placeholder={color}
        {...props}
      >
        <ChakraNumberInput.Control />
        <ChakraNumberInput.Input />
      </ChakraNumberInput.Root>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {!error && helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  )
}