import { Stack, Flex, Box } from '@chakra-ui/react'
import MainLayout from '../components/Layout/MainLayout'
import ControlsPanel from '../features/shapeGenerator/ControlsPanel'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'
import ModeToggle from '../features/mode/ModeToggle'
import { useWebSocket } from '../hooks/useWebSocket'

/**
 * Main App Component - Retro Mac Style
 *
 * Two-panel layout:
 * - Left: Controls panel (retro Mac window with all configuration)
 * - Right: Terminal output (ASCII display with generate button)
 */
function App() {
  const { socket, isConnected } = useWebSocket()

  return (
    <MainLayout>
      <Stack gap={6}>
        {/* Mode Toggle - Switch between Manual and AI Mode */}
        <Box display="flex" justifyContent="center" py={4}>
          <ModeToggle />
        </Box>

        {/* Main Content */}
        <Flex gap={6} alignItems="flex-start">
          {/* Left Side: Controls Panel */}
          <Box minWidth="25%" maxWidth="35%">
            <ControlsPanel socket={socket} isConnected={isConnected} />
          </Box>

          {/* Right Side: Terminal Output */}
          <Box flex={1}>
            <AsciiDisplay socket={socket} />
          </Box>
        </Flex>
      </Stack>
    </MainLayout>
  )
}

export default App
