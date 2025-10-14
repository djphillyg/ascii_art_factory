import { useDispatch, useSelector } from 'react-redux'
import { Box, Stack, Text, Textarea } from '@chakra-ui/react'
import { terminalTheme } from '../../theme/terminal'
import {
  selectPrompt,
  selectStatus,
  selectIsGenerating,
  setPrompt,
  generateShapeAISync,
} from './aiInputSlice'
import ButtonInput from '../shapeGenerator/inputs/ButtonInput'

/**
 * AIInputPanel Component
 *
 * Natural language input interface for AI-powered ASCII art generation
 * Displays when mode is set to "AI"
 */
export default function AIInputPanel({ socket, isConnected }) {
  const dispatch = useDispatch()
  const prompt = useSelector(selectPrompt)
  const status = useSelector(selectStatus)
  const isGenerating = useSelector(selectIsGenerating)

  const handlePromptChange = (e) => {
    dispatch(setPrompt(e.target.value))
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return

    console.log('Generating AI ASCII art:', { prompt })
    if (socket && isConnected) {
      socket.emit('generateAIShape', { prompt })
    } else {
      await dispatch(
        generateShapeAISync({
          prompt,
        })
      )
    }

    // TODO: Implement AI generation API call
    // Will connect to /api/ai/generate endpoint
  }

  return (
    <Stack gap={6}>
      {/* Prompt Input Section */}
      <Box>
        <Text
          fontFamily={terminalTheme.fonts.retro}
          fontSize="xs"
          fontWeight="bold"
          color={terminalTheme.colors.retro.text}
          mb={2}
        >
          &gt; DESCRIBE YOUR IMAGE
        </Text>
        <Textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="e.g., a cat sitting on a windowsill..."
          fontFamily={terminalTheme.fonts.retro}
          fontSize="sm"
          bg="white"
          color={terminalTheme.colors.retro.text}
          border="2px solid"
          borderColor={terminalTheme.colors.retro.border}
          borderRadius="4px"
          minHeight="150px"
          padding="12px"
          _placeholder={{
            color: terminalTheme.colors.gray[400],
          }}
          _focus={{
            outline: 'none',
            borderColor: terminalTheme.colors.retro.border,
            boxShadow: `0 0 0 1px ${terminalTheme.colors.retro.border}`,
          }}
          resize="vertical"
        />
      </Box>

      {/* Generate Button */}
      <ButtonInput
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        size="lg"
        width="100%"
        background={terminalTheme.colors.retro.contentBg}
        border="3px solid"
        borderColor={terminalTheme.colors.retro.border}
        borderRadius="30px"
        color={terminalTheme.colors.retro.text}
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        _disabled={{
          opacity: 0.4,
          cursor: 'not-allowed',
        }}
        fontFamily={terminalTheme.fonts.retro}
        textTransform="uppercase"
        letterSpacing="wider"
        fontWeight="bold"
        transition="all 0.3s ease"
      >
        {isGenerating ? '> GENERATING...' : '> GENERATE WITH AI'}
      </ButtonInput>

      {/* Status Card */}
      <Box
        bg="white"
        border="2px solid"
        borderColor={terminalTheme.colors.retro.border}
        borderRadius="4px"
        padding="16px"
      >
        <Text
          fontFamily={terminalTheme.fonts.retro}
          fontSize="xs"
          fontWeight="bold"
          color={terminalTheme.colors.gray[400]}
          mb={2}
        >
          [ STATUS ]
        </Text>
        <Text
          fontFamily={terminalTheme.fonts.retro}
          fontSize="sm"
          color={terminalTheme.colors.retro.text}
          lineHeight="1.6"
        >
          {status}
        </Text>
      </Box>
    </Stack>
  )
}
