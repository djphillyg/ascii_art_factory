import { useDispatch, useSelector } from 'react-redux'
import { Stack, HStack } from '@chakra-ui/react'
import { selectOptions, updateOptions } from './shapeGeneratorSlice'
import NumberInput from './inputs/NumberInput'
import SharedOptions from './inputs/SharedOptions'
import { useShapeValidation } from './validation/useShapeValidation'

export default function CircleOptions({ showSharedOptions = false }) {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)
  const { errors } = useShapeValidation()

  const handleChange = (key, val) => {
    dispatch(updateOptions({ [key]: val }))
  }

  return (
    <Stack gap={4}>
      <HStack gap={2}>
        <NumberInput
          label="Radius"
          value={options.radius}
          onChange={(val) => handleChange('radius', val)}
          min={1}
          max={100}
          error={errors.radius}
          flex={1}
        />
      </HStack>
      {showSharedOptions && <SharedOptions shapeType="circle" />}
    </Stack>
  )
}