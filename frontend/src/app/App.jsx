import { Box, Stack } from '@chakra-ui/react'
import MainLayout from '../components/Layout/MainLayout'
import ShapeSelector from '../features/shapeGenerator/ShapeSelector'
import OptionsPanel from '../features/shapeGenerator/OptionsPanel'
import GenerateButton from '../features/shapeGenerator/GenerateButton'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'
import { useWebSocket } from '../hooks/useWebSocket'
import { terminalTheme } from '../theme/terminal'

/**
 * Main App Component - Terminal Style
 *
 * Full terminal immersion layout:
 * - Configuration panel (selector + options + generate button)
 * - Output terminal (ASCII display)
 */
function App() {
  const { socket, isConnected } = useWebSocket()

  return (
    <MainLayout>
      <Stack gap={6}>
        {/* Configuration Panel */}
        <Box
          bg={terminalTheme.colors.bg.secondary}
          border="2px solid"
          borderColor={terminalTheme.colors.cyan[500]}
          borderRadius="md"
          boxShadow={terminalTheme.effects.glow.cyan}
          p={6}
        >
          <Stack gap={6}>
            <ShapeSelector />
            <OptionsPanel />
            <GenerateButton socket={socket} isConnected={isConnected} />
          </Stack>
        </Box>

        {/* Terminal Output */}
        <AsciiDisplay socket={socket} />
      </Stack>
    </MainLayout>
  )
}

export default App
