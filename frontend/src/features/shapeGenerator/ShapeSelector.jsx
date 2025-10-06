import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  NativeSelect,
  IconButton,
  Field
} from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'
import { fetchShapes, selectAvailableTypes, selectIsLoadingShapes } from '../shapes/shapesSlice'
import {
  setShape,
  selectCurrentShapeType,
  clearCurrentShape,
} from './shapeGeneratorSlice'

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

  const handleShapeChange = (event) => {
    const selectedShape = event.target.value
    if (selectedShape) {
      dispatch(setShape(selectedShape))
    }
  }

  const hasShapeSelected = (currentShapeType !== null)

  return (
    <Box
      bg="white"
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Field.Root>
        <Field.Label
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="medium"
        >
          Select Shape
        </Field.Label>

        <Box position="relative" width="70%">
          <NativeSelect.Root
            size={{ base: 'sm', md: 'md' }}
            disabled={isLoading}
            width="100%"
          >
            <NativeSelect.Field
              id="shape-select"
              value={currentShapeType || ''}
              onChange={handleShapeChange}
              placeholder="Choose a shape..."
            >
              {availableTypes.map((shapeType) => (
                <option key={shapeType} value={shapeType}>
                  {shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

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

        <Field.HelperText fontSize="sm" color="gray.600">
          {isLoading
            ? 'Loading available shapes...'
            : `${availableTypes.length} shape${availableTypes.length !== 1 ? 's' : ''} available`}
        </Field.HelperText>
      </Field.Root>
    </Box>
  )
}
