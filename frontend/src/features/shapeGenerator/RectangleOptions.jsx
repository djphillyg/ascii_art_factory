import { useDispatch, useSelector } from 'react-redux'
import { Stack } from '@chakra-ui/react'
import { selectOptions, updateOptions } from './shapeGeneratorSlice'
import NumberInput from './inputs/NumberInput'
import SharedOptions from './inputs/SharedOptions'
import { useShapeValidation } from './validation/useShapeValidation'

export default function RectangleOptions() {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)
  const { errors } = useShapeValidation()

  const handleChange = (key, val) => {
    dispatch(updateOptions({ [key]: val }))
  }

  return (
    <Stack gap={4}>
      <NumberInput
        label="Width"
        value={options.width}
        onChange={(val) => handleChange('width', val)}
        min={1}
        max={100}
        error={errors.width}
      />
      <NumberInput
        label="Height"
        value={options.height}
        onChange={(val) => handleChange('height', val)}
        min={1}
        max={100}
        error={errors.height}
      />
      <SharedOptions shapeType="rectangle" />
    </Stack>
  )
}