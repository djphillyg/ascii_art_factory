import { Box, Stack, Flex } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import MainLayout from '../components/Layout/MainLayout'
import ShapeSelector from '../features/shapeGenerator/ShapeSelector'
import OptionsPanel from '../features/shapeGenerator/OptionsPanel'
import SharedOptionsPanel from '../features/shapeGenerator/SharedOptionsPanel'
import GenerateButton from '../features/shapeGenerator/GenerateButton'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'
import TransformPanel from '../features/shapeGenerator/TransformPanel'
import { useWebSocket } from '../hooks/useWebSocket'
import { terminalTheme } from '../theme/terminal'
import { selectShapeOutput, selectIsGenerating, selectIsTransforming, selectCurrentShapeType } from '../features/shapeGenerator/shapeGeneratorSlice'

/**
 * Main App Component - Terminal Style
 *
 * Full terminal immersion layout:
 * - Configuration panel (selector + options + generate button)
 * - Output terminal (ASCII display)
 */
function App() {
  const { socket, isConnected } = useWebSocket()
  const shapeOutput = useSelector(selectShapeOutput)
  const isGenerating = useSelector(selectIsGenerating)
  const isTransforming = useSelector(selectIsTransforming)
  const currentShapeType = useSelector(selectCurrentShapeType)

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
            {/* Shape Selector and Configuration on same row */}
            <Flex gap={6} alignItems="flex-start">
              <Box flex="1">
                <ShapeSelector />
              </Box>
              <Box flex="1">
                <OptionsPanel />
              </Box>
            </Flex>

            {/* Shared Options (filled, fillPattern) - appears below config when shape is selected */}
            {currentShapeType && <SharedOptionsPanel />}

            {/* Transform Panel - Only appears after shape generation */}
            {
              (shapeOutput || isTransforming) && !isGenerating && (
                <TransformPanel socket={socket} isConnected={isConnected} />
              )
            }

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
