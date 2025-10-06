import { Checkbox } from '@chakra-ui/react'

/**
 * Reusable CheckboxInput component
 * Wraps Chakra UI Checkbox for consistent styling
 */
export default function CheckboxInput({
  label,
  checked,
  onChange,
  ...props
}) {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(e) => onChange(e.checked)}
      {...props}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  )
}