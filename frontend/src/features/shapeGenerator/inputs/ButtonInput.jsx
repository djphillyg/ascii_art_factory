import { Button } from '@chakra-ui/react'

/**
 * Reusable ButtonInput component
 * Wraps Chakra UI Button for consistent styling
 */
export default function ButtonInput({
  children,
  onClick,
  disabled = false,
  loading = false,
  colorPalette = 'blue',
  variant = 'solid',
  size = 'md',
  width,
  ...props
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      colorPalette={colorPalette}
      variant={variant}
      size={size}
      width={width}
      {...props}
    >
      {children}
    </Button>
  )
}