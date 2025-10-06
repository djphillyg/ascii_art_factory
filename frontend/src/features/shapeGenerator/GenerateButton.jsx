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
export default function GenerateButton() {
  const dispatch = useDispatch()
  const currentShapeType = useSelector(selectCurrentShapeType)
  const currentShape = useSelector(selectCurrentShape)
  const options = useSelector(selectOptions)
  const { isValid } = useShapeValidation()

  // TODO: Create handleGenerate function that:
  // 1. Dispatches an async thunk (e.g., generateShape) that makes API call to backend
  // 2. The API call should POST to /api/generate with { type: currentShapeType, options }
  // 3. Handle loading state (button shows loading spinner during API call)
  // 4. Handle success (store ASCII art result in Redux state)
  // 5. Handle errors (show error message to user)

  const handleGenerate = async () => {
    if (!isValid) return

    // TODO: Dispatch generateShape async thunk
    console.log('Generating shape:', { type: currentShapeType, options })
    // dispatch the shape out as an action
    // TODO: shouldnt this be async or some shit 
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