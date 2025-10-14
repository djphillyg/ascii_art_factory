import { Box, Text, Switch, Tooltip } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMode, selectCurrentMode } from './modeSlice'
import { terminalTheme } from '../../theme/terminal'

/**
 * ModeToggle Component
 *
 * A sliding toggle switch to select between Manual Mode and AI Mode
 * Follows the terminal theme design system
 *
 * In production, AI mode is disabled to prevent API token drainage
 */
export default function ModeToggle() {
  const dispatch = useDispatch()
  const currentMode = useSelector(selectCurrentMode)
  const isManualMode = currentMode === 'manual'
  const isProduction = import.meta.env.PROD

  const handleToggle = () => {
    // Don't allow toggling to AI mode in production
    if (isProduction) return
    dispatch(toggleMode())
  }

  const toggleContent = (
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
      opacity={isProduction ? 0.6 : 1}
      cursor={isProduction ? 'not-allowed' : 'pointer'}
      _hover={
        isProduction
          ? {}
          : {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }
      }
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
      <Switch.Root
        checked={!isManualMode}
        onCheckedChange={handleToggle}
        size="md"
        disabled={isProduction}
      >
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

  return isProduction ? (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{toggleContent}</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          bg={terminalTheme.colors.retro.contentBg}
          color={terminalTheme.colors.retro.text}
          border="2px solid"
          borderColor={terminalTheme.colors.retro.border}
          borderRadius="md"
          padding={3}
          fontFamily={terminalTheme.fonts.retro}
          fontSize="sm"
          maxWidth="300px"
          textAlign="center"
        >
          AI Mode disabled on the front-end so your kind developer doesn't drain his account.
          Prefilled recipes available soon :)
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  ) : (
    toggleContent
  )
}
