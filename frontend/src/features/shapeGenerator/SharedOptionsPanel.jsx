import { useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { selectCurrentShapeType } from './shapeGeneratorSlice'
import SharedOptions from './inputs/SharedOptions'

/**
 * SharedOptionsPanel Component
 *
 * Displays only the shared options (filled, fillPattern) for the selected shape
 * This is used separately from the main OptionsPanel to allow flexible layout
 */
export default function SharedOptionsPanel() {
  const currentShapeType = useSelector(selectCurrentShapeType)

  if (!currentShapeType) {
    return null
  }

  return (
    <Box>
      <SharedOptions shapeType={currentShapeType} />
    </Box>
  )
}