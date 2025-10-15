import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Stack, HStack, Text, Flex } from '@chakra-ui/react'
import { terminalTheme } from '../../theme/terminal'
import { fetchShapes, selectAvailableTypes, selectIsLoadingShapes } from '../shapes/shapesSlice'
import {
  setShape,
  selectCurrentShapeType,
  selectOptions,
  updateOptions,
  selectShapeOutput,
  selectIsTransforming,
  selectIsGenerating,
  transformShapeAsync,
} from './shapeGeneratorSlice'
import { selectIsAiMode } from '../mode/modeSlice'
import { useShapeValidation } from './validation/useShapeValidation'
import SelectInput from './inputs/SelectInput'
import NumberInput from './inputs/NumberInput'
import CheckboxInput from './inputs/CheckboxInput'
import ButtonInput from './inputs/ButtonInput'
import GenerateButton from './GenerateButton'
import AIInputPanel from '../aiInput/AIInputPanel'

/**
 * ControlsPanel Component
 *
 * Unified retro Mac-style controls panel that combines all shape configuration
 * in a single terminal window with classic Mac aesthetic
 */
export default function ControlsPanel({ socket, isConnected }) {
  const dispatch = useDispatch()
  const availableTypes = useSelector(selectAvailableTypes)
  const currentShapeType = useSelector(selectCurrentShapeType)
  const isLoading = useSelector(selectIsLoadingShapes)
  const options = useSelector(selectOptions)
  const shapeOutput = useSelector(selectShapeOutput)
  const isTransforming = useSelector(selectIsTransforming)
  const isGenerating = useSelector(selectIsGenerating)
  const isAiMode = useSelector(selectIsAiMode)
  const { errors } = useShapeValidation()

  // Fetch available shapes when component mounts
  useEffect(() => {
    dispatch(fetchShapes())
  }, [dispatch])

  const handleShapeChange = (selectedShape) => {
    if (selectedShape) {
      dispatch(setShape(selectedShape))
    }
  }

  const handleOptionChange = (key, value) => {
    dispatch(updateOptions({ [key]: value }))
  }

  const handleTransform = async (type, params) => {
    console.log('🔧 Transform requested:', {
      type,
      params,
      socketConnected: isConnected,
      socketId: socket?.id,
    })
    if (socket && isConnected) {
      console.log('📤 Emitting transformShape via socket:', socket.id)
      socket.emit('transformShape', { shape: shapeOutput, transformation: { type, params } })
    } else {
      console.log('📤 Using HTTP fallback for transform')
      await dispatch(
        transformShapeAsync({
          shape: shapeOutput,
          transformation: { type, params },
        })
      )
    }
  }

  const fillPatternOptions = ['dots', 'gradient', 'diagonal', 'crosshatch']
  const fillDirectionOptions = ['horizontal', 'vertical']
  const isGradient = options.fillPattern === 'gradient'

  // Render shape-specific configuration inputs
  const renderShapeConfig = () => {
    switch (currentShapeType) {
      case 'rectangle':
        return (
          <HStack gap={4}>
            <NumberInput
              label="Width"
              value={options.width}
              onChange={(val) => handleOptionChange('width', val)}
              min={1}
              max={100}
              error={errors.width}
              flex={1}
            />
            <NumberInput
              label="Height"
              value={options.height}
              onChange={(val) => handleOptionChange('height', val)}
              min={1}
              max={100}
              error={errors.height}
              flex={1}
            />
          </HStack>
        )
      case 'circle':
        return (
          <NumberInput
            label="Radius"
            value={options.radius}
            onChange={(val) => handleOptionChange('radius', val)}
            min={1}
            max={50}
            error={errors.radius}
          />
        )
      case 'polygon':
        return (
          <Stack gap={4}>
            <NumberInput
              label="Sides"
              value={options.sides}
              onChange={(val) => handleOptionChange('sides', val)}
              min={3}
              max={12}
              error={errors.sides}
            />
            <NumberInput
              label="Size"
              value={options.size}
              onChange={(val) => handleOptionChange('size', val)}
              min={1}
              max={50}
              error={errors.size}
            />
          </Stack>
        )
      case 'text':
        return (
          <Stack gap={4}>
            <Box>
              <Text
                fontFamily={terminalTheme.fonts.retro}
                fontSize="xs"
                color={terminalTheme.colors.gray[400]}
                mb={2}
              >
                Text Content
              </Text>
              <input
                type="text"
                value={options.text || ''}
                onChange={(e) => handleOptionChange('text', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontFamily: terminalTheme.fonts.retro,
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: `2px solid ${terminalTheme.colors.retro.border}`,
                  borderRadius: '4px',
                }}
              />
            </Box>
            {isGradient && (
              <HStack gap={4}>
                <NumberInput
                  label="Width"
                  value={options.width}
                  onChange={(val) => handleOptionChange('width', val)}
                  min={1}
                  max={100}
                  error={errors.width}
                  flex={1}
                />
                <NumberInput
                  label="Height"
                  value={options.height}
                  onChange={(val) => handleOptionChange('height', val)}
                  min={1}
                  max={100}
                  error={errors.height}
                  flex={1}
                />
              </HStack>
            )}
          </Stack>
        )
      default:
        return null
    }
  }

  return (
    <Box
      border="2px solid"
      borderColor={terminalTheme.colors.retro.border}
      borderRadius="8px"
      overflow="hidden"
      height="100%"
    >
      {/* Window Title Bar */}
      <Flex
        bg={terminalTheme.colors.retro.titleBar}
        borderBottom="2px solid"
        borderColor={terminalTheme.colors.retro.border}
        px={4}
        py={2}
        alignItems="center"
        gap={3}
      >
        <HStack gap={2}>
          <Box w="12px" h="12px" borderRadius="50%" bg={terminalTheme.colors.retro.buttonRed} />
          <Box w="12px" h="12px" borderRadius="50%" bg={terminalTheme.colors.retro.buttonYellow} />
          <Box w="12px" h="12px" borderRadius="50%" bg={terminalTheme.colors.retro.buttonGreen} />
        </HStack>
        <Text
          fontFamily={terminalTheme.fonts.retro}
          fontSize="sm"
          fontWeight="bold"
          color={terminalTheme.colors.retro.text}
        >
          controls
        </Text>
      </Flex>

      {/* Window Content */}
      <Box bg={terminalTheme.colors.retro.dottedBg} {...terminalTheme.effects.dottedPattern} p={6}>
        {isAiMode ? (
          /* AI Mode - Show AI Input Panel */
          <AIInputPanel socket={socket} isConnected={isConnected} />
        ) : (
          /* Manual Mode - Show Shape Controls */
          <Stack gap={6}>
            {/* Shape Type Selector */}
            <Box>
              <Text
                fontFamily={terminalTheme.fonts.retro}
                fontSize="xs"
                fontWeight="bold"
                color={terminalTheme.colors.retro.text}
                mb={2}
              >
                &gt; SHAPE TYPE
              </Text>
              <SelectInput
                value={currentShapeType}
                onChange={handleShapeChange}
                options={availableTypes}
                placeholder="Choose a shape..."
                helperText={isLoading ? '[ Loading... ]' : `[ ${availableTypes.length} loaded ]`}
                disabled={isLoading}
              />
            </Box>

            {/* Shape Configuration */}
            {currentShapeType && (
              <>
                <Box>
                  <Text
                    fontFamily={terminalTheme.fonts.retro}
                    fontSize="xs"
                    fontWeight="bold"
                    color={terminalTheme.colors.retro.text}
                    mb={3}
                  >
                    &gt; CONFIG
                  </Text>
                  {renderShapeConfig()}
                </Box>

                {/* Filled Checkbox */}
                <Box mt={-5}>
                  <CheckboxInput
                    label="Filled"
                    checked={options.filled}
                    onChange={(val) => handleOptionChange('filled', val)}
                  />
                </Box>

                {/* Fill Pattern */}
                <Box>
                  <Text
                    fontFamily={terminalTheme.fonts.retro}
                    fontSize="s"
                    color={terminalTheme.colors.text.primary}
                    mb={2}
                  >
                    Fill Pattern
                  </Text>
                  <SelectInput
                    value={options.fillPattern}
                    options={fillPatternOptions}
                    onChange={(val) => handleOptionChange('fillPattern', val)}
                    error={errors.fillPattern}
                  />
                </Box>

                {/* Gradient Direction - only show if gradient is selected */}
                {isGradient && (
                  <Box>
                    <Text
                      fontFamily={terminalTheme.fonts.retro}
                      fontSize="xs"
                      color={terminalTheme.colors.gray[400]}
                      mb={2}
                    >
                      Gradient Direction
                    </Text>
                    <SelectInput
                      value={options.direction}
                      options={fillDirectionOptions}
                      onChange={(val) => handleOptionChange('direction', val)}
                      error={errors.direction}
                    />
                  </Box>
                )}
              </>
            )}

            {/* Transform Section - Show when shape has been rendered, is generating, or is transforming */}
            {(shapeOutput || isGenerating || isTransforming) && (
              <Box>
                <Text
                  fontFamily={terminalTheme.fonts.retro}
                  fontSize="xs"
                  fontWeight="bold"
                  color={terminalTheme.colors.retro.text}
                  mb={3}
                >
                  &gt; TRANSFORM
                </Text>
                <Stack gap={4}>
                  {/* Rotate */}
                  <Box>
                    <Text
                      fontFamily={terminalTheme.fonts.retro}
                      fontSize="xs"
                      color={terminalTheme.colors.gray[400]}
                      mb={2}
                    >
                      [ ROTATE ]
                    </Text>
                    <HStack gap={2}>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('rotate', { degrees: 0 })}
                        disabled={isTransforming}
                      >
                        0°
                      </ButtonInput>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('rotate', { degrees: 90 })}
                        disabled={isTransforming}
                      >
                        90°
                      </ButtonInput>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('rotate', { degrees: 180 })}
                        disabled={isTransforming}
                      >
                        180°
                      </ButtonInput>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('rotate', { degrees: 270 })}
                        disabled={isTransforming}
                      >
                        270°
                      </ButtonInput>
                    </HStack>
                  </Box>

                  {/* Scale */}
                  <Box>
                    <Text
                      fontFamily={terminalTheme.fonts.retro}
                      fontSize="xs"
                      color={terminalTheme.colors.gray[400]}
                      mb={2}
                    >
                      [ SCALE ]
                    </Text>
                    <HStack gap={2}>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('scale', { factor: 0.5 })}
                        disabled={isTransforming}
                      >
                        0.5x
                      </ButtonInput>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('scale', { factor: 2 })}
                        disabled={isTransforming}
                      >
                        2x
                      </ButtonInput>
                    </HStack>
                  </Box>

                  {/* Mirror */}
                  <Box>
                    <Text
                      fontFamily={terminalTheme.fonts.retro}
                      fontSize="xs"
                      color={terminalTheme.colors.gray[400]}
                      mb={2}
                    >
                      [ MIRROR ]
                    </Text>
                    <HStack gap={2}>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('mirror', { axis: 'horizontal' })}
                        disabled={isTransforming}
                      >
                        Horizontal
                      </ButtonInput>
                      <ButtonInput
                        size="sm"
                        flex={1}
                        onClick={() => handleTransform('mirror', { axis: 'vertical' })}
                        disabled={isTransforming}
                      >
                        Vertical
                      </ButtonInput>
                    </HStack>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Generate Button */}
            <GenerateButton socket={socket} isConnected={isConnected} />
          </Stack>
        )}
      </Box>
    </Box>
  )
}
