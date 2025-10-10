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
      await dispatch(
        generateShapeAsync({
          type: currentShapeType,
          options,
        })
      )
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
        background="#F5E8E0"
        boxShadow="0px 0px 0px 3px #1A1A1A, inset 2px 2px 0px 0px rgba(255, 255, 255, 0.5), inset -2px -2px 0px 0px rgba(0, 0, 0, 0.15), 0px 4px 6px 0px rgba(0, 0, 0, 0.1)"
        border="2px solid"
        color="green.500"
        _hover={{
          bg: 'green.500',
          color: 'black',
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
        &gt; GENERATE
      </ButtonInput>
    </Box>
  )
}
