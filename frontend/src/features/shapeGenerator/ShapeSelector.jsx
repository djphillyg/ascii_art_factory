import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  IconButton,
  Text
} from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'
import { terminalTheme } from '../../theme/terminal'
import { fetchShapes, selectAvailableTypes, selectIsLoadingShapes } from '../shapes/shapesSlice'
import {
  setShape,
  selectCurrentShapeType,
  clearCurrentShape,
} from './shapeGeneratorSlice'
import SelectInput from './inputs/SelectInput'

/**
 * ShapeSelector Component
 *
 * Dropdown selector for choosing a shape type.
 * Fetches available shapes from the API and dispatches setShape action on change.
 */
export default function ShapeSelector() {
  const dispatch = useDispatch()
  const availableTypes = useSelector(selectAvailableTypes)
  const currentShapeType = useSelector(selectCurrentShapeType)
  const isLoading = useSelector(selectIsLoadingShapes)

  // Fetch available shapes when component mounts
  useEffect(() => {
    dispatch(fetchShapes())
  }, [dispatch])

  const handleShapeChange = (selectedShape) => {
    if (selectedShape) {
      dispatch(setShape(selectedShape))
    }
  }

  const hasShapeSelected = (currentShapeType !== null)

  return (
    <Box>
      <Box>
        <Text
          color={terminalTheme.colors.green[500]}
          fontSize="sm"
          fontWeight="bold"
          mb={2}
          textTransform="uppercase"
          letterSpacing="wider"
        >
          &gt; Select Shape Type
        </Text>

        <Box position="relative" width="70%">
          <SelectInput
            value={currentShapeType}
            onChange={handleShapeChange}
            options={availableTypes}
            placeholder="Choose a shape..."
            helperText={
              isLoading
                ? '[ Loading shapes... ]'
                : `[ ${availableTypes.length} shape${availableTypes.length !== 1 ? 's' : ''} loaded ]`
            }
            size={{ base: 'sm', md: 'md' }}
            disabled={isLoading}
          />

          {hasShapeSelected && (
            <IconButton
              aria-label="Clear selection"
              position="absolute"
              right="8"
              top="50%"
              transform="translateY(-50%)"
              size="sm"
              variant="ghost"
              onClick={() => dispatch(clearCurrentShape())}
            >
              <LuX />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  )
}
