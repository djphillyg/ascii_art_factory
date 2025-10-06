import { Grid, GridItem, Box, Text } from '@chakra-ui/react'
import MainLayout from '../components/Layout/MainLayout'
import ShapeSelector from '../features/shapeGenerator/ShapeSelector'
import OptionsPanel from '../features/shapeGenerator/OptionsPanel'
import GenerateButton from '../features/shapeGenerator/GenerateButton'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'
import { useWebSocket } from '../hooks/useWebSocket'

/**
 * Main App Component
 *
 * Uses Chakra's Grid for responsive layout:
 * - Single column on mobile (base)
 * - Two columns on desktop (md+)
 *
 * Grid concepts:
 * - Grid: container with display: grid
 * - GridItem: child elements with grid placement
 * - templateColumns: defines column structure
 *   - "1fr" = 1 fraction (full width on mobile)
 *   - "repeat(2, 1fr)" = 2 equal columns on desktop
 * - gap: spacing between grid items (responsive)
 */
function App() {
  const { socket, isConnected } = useWebSocket()

  return (
    <MainLayout>
      {/* WebSocket Status Indicator */}
      <Box
        position="fixed"
        bottom={4}
        right={4}
        bg={isConnected ? 'green.600' : 'red.600'}
        color="white"
        px={3}
        py={2}
        borderRadius="md"
        fontSize="sm"
        boxShadow="lg"
        zIndex={1000}
      >
        <Text fontWeight="medium">
          {isConnected ? '🟢 WebSocket Connected' : '🔴 WebSocket Disconnected'}
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        templateRows="auto 1fr"
        gap={{ base: 4, md: 6 }}
      >
        {/* Left column */}
        <GridItem>
          <ShapeSelector />
          <OptionsPanel />
        </GridItem>

        {/* Right column */}
        <GridItem>
          <GenerateButton socket={socket} isConnected={isConnected} />
        </GridItem>

        {/* Full width bottom row */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <AsciiDisplay socket={socket} />
        </GridItem>
      </Grid>
    </MainLayout>
  )
}

export default App
