import { useDispatch, useSelector } from 'react-redux'
import { Stack } from '@chakra-ui/react'
import { selectOptions, updateOptions } from './shapeGeneratorSlice'
import TextInput from './inputs/TextInput'
import SharedOptions from './inputs/SharedOptions'
import { useShapeValidation } from './validation/useShapeValidation'

export default function TextOptions() {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)
  const { errors } = useShapeValidation()

  const handleChange = (key, val) => {
    dispatch(updateOptions({ [key]: val }))
  }

  return (
    <Stack gap={4}>
      <TextInput
        label="Text"
        value={options.text}
        onChange={(val) => handleChange('text', val)}
        placeholder="HELLOWORLD"
        helperText="Only uppercase letters (A-Z) and numbers (0-9)"
        error={errors.text}
      />
      <SharedOptions shapeType="text" />
    </Stack>
  )
}