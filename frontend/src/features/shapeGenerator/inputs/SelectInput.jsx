import { NativeSelect, Field } from '@chakra-ui/react'

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
  color ="rgb(240, 255, 255)",
  ...props
}) {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <NativeSelect.Root {...props}>
        <NativeSelect.Field
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          color={color}
          _placeholder={color}

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
      {!error && helperText && <Field.HelperText color={color}>{helperText}</Field.HelperText>}
    </Field.Root>
  )
}