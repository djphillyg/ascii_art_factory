import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import ButtonInput from './inputs/ButtonInput'
import { generateShapeAsync, selectCurrentShapeType, selectOptions } from './shapeGeneratorSlice'
import { useShapeValidation } from './validation/useShapeValidation'

/**
 * GenerateButton Component
 *
 * Triggers shape generation based on current shape type and options
 * Always visible, validates before making API call
 */
export default function GenerateButton({ socket, isConnected }) {
  const dispatch = useDispatch()
  const currentShapeType = useSelector(selectCurrentShapeType)
  const options = useSelector(selectOptions)
  const { isValid } = useShapeValidation()

  // TODO: WebSocket Implementation
  // 1. Check if socket is connected (isConnected)
  // 2. If connected, use WebSocket instead of HTTP:
  //    - socket.emit('generate-shape', { type: currentShapeType, options })
  // 3. If not connected, fallback to existing HTTP:
  //    - await dispatch(generateShapeAsync({ type, options }))
  // 4. Add loading state (useState) to show spinner on button
  // 5. Optional: Listen for 'generation-error' and fallback to HTTP if needed

  const handleGenerate = async () => {
    if (!isValid) return

    console.log('Generating shape:', { type: currentShapeType, options })
    if (socket && isConnected) {
      socket.emit('generateShape', { type: currentShapeType, options })
    } else {
      await dispatch(generateShapeAsync({
        type: currentShapeType,
        options
      }))
    }
  }

  return (
    <Box>
      <ButtonInput
        onClick={handleGenerate}
        disabled={!isValid}
        colorPalette="green"
        size="lg"
        width="full"
        bg="transparent"
        border="2px solid"
        borderColor="green.500"
        color="green.500"
        _hover={{
          bg: 'green.500',
          color: 'black',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.8)'
        }}
        _disabled={{
          opacity: 0.4,
          cursor: 'not-allowed',
        }}
        fontFamily="monospace"
        textTransform="uppercase"
        letterSpacing="wider"
        fontWeight="bold"
      >
        &gt; Run Generation
      </ButtonInput>
    </Box>
  )
}