import { Box, Text, Switch } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMode, selectCurrentMode } from './modeSlice'
import { terminalTheme } from '../../theme/terminal'

/**
 * ModeToggle Component
 *
 * A sliding toggle switch to select between Manual Mode and AI Mode
 * Follows the terminal theme design system
 */
export default function ModeToggle() {
  const dispatch = useDispatch()
  const currentMode = useSelector(selectCurrentMode)
  const isManualMode = currentMode === 'manual'

  const handleToggle = () => {
    dispatch(toggleMode())
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={3}
      padding={4}
      bg={terminalTheme.colors.retro.contentBg}
      border="3px solid"
      borderColor={terminalTheme.colors.retro.border}
      borderRadius="30px"
      width="fit-content"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Manual Mode Label */}
      <Text
        fontSize="md"
        fontWeight="bold"
        fontFamily={terminalTheme.fonts.retro}
        letterSpacing="wider"
        color={isManualMode ? terminalTheme.colors.retro.text : terminalTheme.colors.gray[400]}
        transition="color 0.3s ease"
        userSelect="none"
      >
        MANUAL MODE
      </Text>

      {/* Switch */}
      <Switch.Root checked={!isManualMode} onCheckedChange={handleToggle} size="md">
        <Switch.HiddenInput />
        <Switch.Control
          bg={terminalTheme.colors.retro.border}
          borderRadius="full"
          _checked={{
            bg: terminalTheme.colors.retro.border,
          }}
        >
          <Switch.Thumb
            bg="white"
            borderRadius="full"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.2)"
          />
        </Switch.Control>
      </Switch.Root>

      {/* AI Mode Label */}
      <Text
        fontSize="md"
        fontWeight="bold"
        fontFamily={terminalTheme.fonts.retro}
        letterSpacing="wider"
        color={!isManualMode ? terminalTheme.colors.retro.text : terminalTheme.colors.gray[400]}
        transition="color 0.3s ease"
        userSelect="none"
      >
        AI MODE
      </Text>
    </Box>
  )
}
