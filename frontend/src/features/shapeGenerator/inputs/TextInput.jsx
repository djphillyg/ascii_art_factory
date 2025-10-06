import { Input, Field } from '@chakra-ui/react'

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
  ...props
}) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {!error && helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  )
}