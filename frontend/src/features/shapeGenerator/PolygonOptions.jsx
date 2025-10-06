import { useDispatch, useSelector } from 'react-redux'
import { Stack } from '@chakra-ui/react'
import { selectOptions, updateOptions } from './shapeGeneratorSlice'
import NumberInput from './inputs/NumberInput'
import SharedOptions from './inputs/SharedOptions'
import { useShapeValidation } from './validation/useShapeValidation'

export default function PolygonOptions() {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)
  const { errors } = useShapeValidation()

  const handleChange = (key, val) => {
    dispatch(updateOptions({ [key]: val }))
  }

  return (
    <Stack gap={4}>
      <NumberInput
        label="Radius"
        value={options.radius}
        onChange={(val) => handleChange('radius', val)}
        min={1}
        max={100}
        error={errors.radius}
      />
      <NumberInput
        label="Sides"
        value={options.sides}
        onChange={(val) => handleChange('sides', val)}
        min={3}
        max={100}
        error={errors.sides}
      />
      <SharedOptions shapeType="polygon" />
    </Stack>
  )
}