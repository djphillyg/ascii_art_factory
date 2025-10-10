import { useDispatch, useSelector } from 'react-redux'
import { Box, Stack, Text, Flex, HStack } from '@chakra-ui/react'
import { terminalTheme } from '../../theme/terminal'
import ButtonInput from './inputs/ButtonInput'
import {
  transformShapeAsync,
  selectShapeOutput,
  selectIsTransforming,
  selectTransformError,
} from './shapeGeneratorSlice'

/**
 * Helper component for transform buttons with consistent styling
 */
const TransformButton = ({ onClick, disabled, colorTheme, children }) => {
  return (
    <ButtonInput
      onClick={onClick}
      disabled={disabled}
      size="sm"
      bg={terminalTheme.colors.bg.tertiary}
      color={terminalTheme.colors[colorTheme][400]}
      border="1px solid"
      borderColor={terminalTheme.colors[colorTheme][700]}
      _hover={{
        bg: terminalTheme.colors[colorTheme][900],
        borderColor: terminalTheme.colors[colorTheme][500],
        boxShadow: terminalTheme.effects.glow[colorTheme],
      }}
      _disabled={{
        opacity: 0.4,
        cursor: 'not-allowed',
      }}
      fontFamily={terminalTheme.fonts.mono}
      fontSize="xs"
    >
      {children}
    </ButtonInput>
  )
}

/**
 * TransformPanel Component
 *
 * Displays transformation controls after a shape has been generated.
 * Follows the same terminal design paradigm as OptionsPanel and ShapeSelector.
 * Only appears after shape generation is complete.
 */
export default function TransformPanel({ socket, isConnected }) {
  const dispatch = useDispatch()
  const shapeOutput = useSelector(selectShapeOutput)
  const isTransforming = useSelector(selectIsTransforming)
  const transformError = useSelector(selectTransformError)

  const handleTransform = async (type, params) => {
    console.log('Transforming shape', {type, params})
    if (socket && isConnected) {
      socket.emit('transformShape', { shape: shapeOutput, transformation: { type, params }})
    } else {
      await dispatch(
      transformShapeAsync({
        shape: shapeOutput,
        transformation: { type, params },
      })
    )
    }
  }

  return (
    <Box>
      <Text
        color={terminalTheme.colors.magenta[500]}
        fontSize="sm"
        fontWeight="bold"
        mb={3}
        textTransform="uppercase"
        letterSpacing="wider"
      >
        &gt; Transform
      </Text>

      <Stack gap={4}>
        {/* All Transform Controls on One Row */}
        <HStack gap={4} alignItems="flex-start" wrap="wrap">
          {/* Rotate Controls */}
          <Box>
            <Text
              color={terminalTheme.colors.gray[400]}
              fontSize="xs"
              mb={2}
              fontFamily={terminalTheme.fonts.mono}
            >
              [ ROTATE ]
            </Text>
            <Flex gap={2}>
              <TransformButton
                onClick={() => handleTransform('rotate', { degrees: 90 })}
                disabled={isTransforming}
                colorTheme="cyan"
              >
                90°
              </TransformButton>
              <TransformButton
                onClick={() => handleTransform('rotate', { degrees: 180 })}
                disabled={isTransforming}
                colorTheme="cyan"
              >
                180°
              </TransformButton>
              <TransformButton
                onClick={() => handleTransform('rotate', { degrees: 270 })}
                disabled={isTransforming}
                colorTheme="cyan"
              >
                270°
              </TransformButton>
            </Flex>
          </Box>

          {/* Mirror Controls */}
          <Box>
            <Text
              color={terminalTheme.colors.gray[400]}
              fontSize="xs"
              mb={2}
              fontFamily={terminalTheme.fonts.mono}
            >
              [ MIRROR ]
            </Text>
            <Flex gap={2}>
              <TransformButton
                onClick={() => handleTransform('mirror', { axis: 'horizontal' })}
                disabled={isTransforming}
                colorTheme="magenta"
              >
                Horizontal
              </TransformButton>
              <TransformButton
                onClick={() => handleTransform('mirror', { axis: 'vertical' })}
                disabled={isTransforming}
                colorTheme="magenta"
              >
                Vertical
              </TransformButton>
            </Flex>
          </Box>

          {/* Scale Controls */}
          <Box>
            <Text
              color={terminalTheme.colors.gray[400]}
              fontSize="xs"
              mb={2}
              fontFamily={terminalTheme.fonts.mono}
            >
              [ SCALE ]
            </Text>
            <Flex gap={2}>
              <TransformButton
                onClick={() => handleTransform('scale', { factor: 0.5 })}
                disabled={isTransforming}
                colorTheme="yellow"
              >
                0.5x
              </TransformButton>
              <TransformButton
                onClick={() => handleTransform('scale', { factor: 2 })}
                disabled={isTransforming}
                colorTheme="yellow"
              >
                2x
              </TransformButton>
            </Flex>
          </Box>
        </HStack>

        {/* Status Messages */}
        {isTransforming && (
          <Text
            color={terminalTheme.colors.cyan[500]}
            fontSize="xs"
            fontFamily={terminalTheme.fonts.mono}
          >
            [ Transforming... ]
          </Text>
        )}

        {transformError && (
          <Text
            color={terminalTheme.colors.red[500]}
            fontSize="xs"
            fontFamily={terminalTheme.fonts.mono}
          >
            [ ERROR: {transformError} ]
          </Text>
        )}
      </Stack>
    </Box>
  )
}