import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import ButtonInput from './inputs/ButtonInput'
import { generateShapeAsync, selectCurrentShape, selectCurrentShapeType, selectOptions } from './shapeGeneratorSlice'
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
  const currentShape = useSelector(selectCurrentShape)
  const options = useSelector(selectOptions)
  const { isValid } = useShapeValidation()

  // TODO: WebSocket Implementation
  // 1. Check if socket is connected (isConnected)
  // 2. If connected, use WebSocket instead of HTTP:
  //    - socket.emit('generateShape', { type: currentShapeType, options })
  // 3. If not connected, fallback to existing HTTP:
  //    - await dispatch(generateShapeAsync({ type, options }))
  // 4. Add loading state (useState) to show spinner on button
  // 5. Listen for WebSocket errors and fallback to HTTP if needed

  const handleGenerate = async () => {
    if (!isValid) return

    // TODO: Replace with WebSocket emit when connected
    // Example:
    // if (socket && isConnected) {
    //   socket.emit('generateShape', { type: currentShapeType, options })
    // } else {
    //   await dispatch(generateShapeAsync({ type: currentShapeType, options }))
    // }

    console.log('Generating shape:', { type: currentShapeType, options })
    await dispatch(generateShapeAsync({
        type: currentShapeType,
        options
    }))
    console.log('did that work ? haha',currentShape)
  }

  return (
    <Box mt={4}>
      <ButtonInput
        onClick={handleGenerate}
        disabled={!isValid}
        colorPalette="blue"
        size="lg"
        width="full"
      >
        Generate Shape
      </ButtonInput>
    </Box>
  )
}