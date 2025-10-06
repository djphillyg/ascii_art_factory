import { Grid, GridItem, Box } from '@chakra-ui/react'
import MainLayout from '../components/Layout/MainLayout'
import ShapeSelector from '../features/shapeGenerator/ShapeSelector'
import OptionsPanel from '../features/shapeGenerator/OptionsPanel'
import GenerateButton from '../features/shapeGenerator/GenerateButton'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'

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
  return (
    <MainLayout>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={{ base: 4, md: 6 }}
        px={{ base: '5px', md: 0 }}
      >
        {/* Left column: Shape selector and options */}
        <GridItem display="flex" flexDirection="column" gap={{ base: 4, md: 6 }}>
          <ShapeSelector />
          <Box flex="1" overflowY="auto">
            <OptionsPanel />
          </Box>
        </GridItem>

        {/* Right column: Preview and display */}
        <GridItem display="flex" flexDirection="column" gap={{ base: 4, md: 6 }}>
          <GenerateButton />
          <Box flex="1" overflowY="auto">
            <AsciiDisplay />
          </Box>
        </GridItem>
      </Grid>
    </MainLayout>
  )
}

export default App
