import { Box, Stack, Flex } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import MainLayout from '../components/Layout/MainLayout'
import ShapeSelector from '../features/shapeGenerator/ShapeSelector'
import OptionsPanel from '../features/shapeGenerator/OptionsPanel'
import GenerateButton from '../features/shapeGenerator/GenerateButton'
import AsciiDisplay from '../features/shapeGenerator/AsciiDisplay'
import TransformPanel from '../features/shapeGenerator/TransformPanel'
import { useWebSocket } from '../hooks/useWebSocket'
import { terminalTheme } from '../theme/terminal'
import { selectShapeOutput, selectIsGenerating, selectIsTransforming } from '../features/shapeGenerator/shapeGeneratorSlice'

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
            {/* Shape Selector and Transform Panel - side by side */}
            <Flex gap={6} alignItems="flex-start">
              <Box flex="1">
                <ShapeSelector />
              </Box>
              {/* Transform Panel - Only appears after shape generation */}
              {
                (shapeOutput || isTransforming) && !isGenerating && (
                  <Box flex="1">
                    <TransformPanel socket={socket} isConnected={isConnected} />
                  </Box>
                )
              }
            </Flex>

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
