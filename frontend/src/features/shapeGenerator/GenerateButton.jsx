import { useDispatch, useSelector } from 'react-redux'
import ButtonInput from './inputs/ButtonInput'
import { generateShapeAsync, selectCurrentShapeType, selectOptions } from './shapeGeneratorSlice'
import { useShapeValidation } from './validation/useShapeValidation'
import { terminalTheme } from '../../theme/terminal'

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
    <ButtonInput
      onClick={handleGenerate}
      disabled={!isValid}
      size="lg"
      width="100%"
      {...terminalTheme.inputStyles}
      borderRadius="30px"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        bg: 'gray.100',
      }}
      _disabled={{
        opacity: 0.4,
        cursor: 'not-allowed',
      }}
      fontFamily={terminalTheme.fonts.retro}
      textTransform="uppercase"
      letterSpacing="wider"
      fontWeight="bold"
      transition="all 0.3s ease"
    >
      &gt; GENERATE
    </ButtonInput>
  )
}
