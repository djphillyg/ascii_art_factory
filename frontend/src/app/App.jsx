import { Stack, Flex, Box } from '@chakra-ui/react'
import MainLayout from '../components/Layout/MainLayout'
import ControlsPanel from '../features/shapeGenerator/ControlsPanel'
import GenerateButton from '../features/shapeGenerator/GenerateButton'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'
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
      <Flex gap={6} alignItems="flex-start">
        {/* Left Side: Controls Panel */}
        <Box minWidth="25%" maxWidth="35%">
          <ControlsPanel socket={socket} isConnected={isConnected} />
        </Box>

        {/* Right Side: Terminal Output and Generate Button */}
        <Stack gap={6} flex={1}>
          <AsciiDisplay socket={socket} />
          <GenerateButton socket={socket} isConnected={isConnected} />
        </Stack>
      </Flex>
    </MainLayout>
  )
}

export default App
