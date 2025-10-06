import { useDispatch, useSelector } from 'react-redux'
import { Stack } from '@chakra-ui/react'
import { selectOptions, updateOptions } from '../shapeGeneratorSlice'
import CheckboxInput from './CheckboxInput'
import SelectInput from './SelectInput'
import NumberInput from './NumberInput'
import { useShapeValidation } from '../validation/useShapeValidation'

/**
 * SharedOptions Component
 *
 * Handles the optional parameters that are shared across all shapes:
 * - filled (boolean)
 * - fillPattern (dots, gradient, diagonal, crosshatch)
 * - direction (horizontal, vertical) - only shown when fillPattern is 'gradient'
 *
 * For text shapes, also conditionally shows width/height inputs when gradient is selected
 */
export default function SharedOptions({ shapeType }) {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)
  const { errors } = useShapeValidation()

  const fillPatternOptions = ['dots', 'gradient', 'diagonal', 'crosshatch']
  const fillDirectionOptions = ['horizontal', 'vertical']

  const handleChange = (key, value) => {
    dispatch(updateOptions({ [key]: value }))
  }

  const isGradient = options.fillPattern === 'gradient'
  const isTextShape = shapeType === 'text'

  return (
    <Stack gap={4} mt={4}>
      <CheckboxInput
        label="Filled"
        checked={options.isFilled}
        onChange={(val) => handleChange('isFilled', val)}
      />

      <SelectInput
        label="Fill Pattern"
        value={options.fillPattern}
        options={fillPatternOptions}
        onChange={(val) => handleChange('fillPattern', val)}
        error={errors.fillPattern}
      />

      {isGradient && (
        <SelectInput
          label="Gradient Direction"
          value={options.direction}
          options={fillDirectionOptions}
          onChange={(val) => handleChange('direction', val)}
          error={errors.direction}
          helperText="Required for gradient pattern"
        />
      )}

      {isGradient && isTextShape && (
        <>
          <NumberInput
            label="Width"
            value={options.width}
            onChange={(val) => handleChange('width', val)}
            min={1}
            max={100}
            error={errors.width}
            helperText="Required for gradient pattern"
          />
          <NumberInput
            label="Height"
            value={options.height}
            onChange={(val) => handleChange('height', val)}
            min={1}
            max={100}
            error={errors.height}
            helperText="Required for gradient pattern"
          />
        </>
      )}
    </Stack>
  )
}