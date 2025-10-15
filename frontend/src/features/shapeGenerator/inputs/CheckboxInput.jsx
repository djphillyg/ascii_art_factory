import { Checkbox } from '@chakra-ui/react'
import { terminalTheme } from '../../../theme/terminal'

/**
 * Reusable CheckboxInput component
 * Wraps Chakra UI Checkbox for consistent styling
 */
export default function CheckboxInput({
  label,
  checked,
  onChange,
  color = terminalTheme.colors.text.primary,
  fontWeight = terminalTheme.fontWeights.standard,
  ...props
}) {
  return (
    <Checkbox.Root checked={checked} onCheckedChange={(e) => onChange(e.checked)} {...props}>
      <Checkbox.HiddenInput />
      <Checkbox.Control
        {...terminalTheme.inputStyles}
        borderRadius="sm"
        _checked={{
          bg: 'black',
          borderColor: 'black',
        }}
      />
      <Checkbox.Label
        color={color}
        fontSize={terminalTheme.fontSizes.label}
        fontWeight={fontWeight}
      >
        {label}
      </Checkbox.Label>
    </Checkbox.Root>
  )
}
