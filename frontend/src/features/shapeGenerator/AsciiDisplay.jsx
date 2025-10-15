import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Text, Flex, HStack } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  selectShapeOutput,
  setGenerating,
  setShapeOutput,
  setGenerateError,
  setTransforming,
  setTransformError,
} from './shapeGeneratorSlice'
import { setStatus } from '../aiInput/aiInputSlice'
import { terminalTheme } from '../../theme/terminal'

// Keyframe animation for row fade-in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export default function AsciiDisplay({ socket }) {
  const dispatch = useDispatch()
  const shapeOutput = useSelector(selectShapeOutput)

  const INITAL_STATE = {
    output: '',
    isStreaming: false,
    error: null,
    totalRows: null,
  }

  const outputRef = useRef('')

  const [local, setLocal] = useState(INITAL_STATE)

  const finalShapeOutput = shapeOutput || local.output

  // Calculate dynamic font size based on content width
  const maxLineLength = finalShapeOutput
    ? Math.max(...finalShapeOutput.split('\n').map((line) => line.length))
    : 0

  const getFontSize = () => {
    if (maxLineLength > 120) return 'xs'
    if (maxLineLength > 80) return 'sm'
    return 'md'
  }

  useEffect(() => {
    if (!socket) {
      console.log('⚠️ Socket not available, skipping listener setup')
      return
    }

    console.log('🎧 Setting up socket listeners for socket:', socket.id)
    console.log('🎧 Socket connected:', socket.connected)

    socket.on('generateStart', ({ totalRows }) => {
      console.log('🟢 generateStart received:', totalRows)
      setLocal({ ...INITAL_STATE, isStreaming: true, totalRows, output: '' })
      outputRef.current = ''
      // we need to sync the state to the async thunk
      dispatch(setGenerating(true))
      dispatch(setShapeOutput(''))
    })

    socket.on('generateRow', ({ data }) => {
      console.log('📊 generateRow received:', data.substring(0, 20))
      // concat the joined row to the local
      setLocal((prev) => ({ ...prev, output: prev.output + data + '\n' }))
      outputRef.current += `${data}\n`
    })

    socket.on('generateComplete', (data) => {
      console.log('🏁 generateComplete received:', data)
      setLocal((prev) => {
        return { ...prev, isStreaming: false }
      })
      dispatch(setShapeOutput(outputRef.current))
      dispatch(setGenerating(false))
    })

    socket.on('generateError', (error) => {
      setLocal((prev) => ({ ...prev, isStreaming: false }))
      dispatch(setGenerateError(error))
    })

    // Transform WebSocket events (same pattern as generate)
    socket.on('transformStart', ({ totalRows }) => {
      console.log('🔄🔄🔄 transformStart received:', totalRows)
      console.log('🔄 Setting local state with isStreaming: true')
      setLocal({ ...INITAL_STATE, isStreaming: true, totalRows, output: '' })
      outputRef.current = ''
      dispatch(setTransforming(true))
      dispatch(setShapeOutput(''))
      console.log('🔄 transformStart processing complete')
    })

    socket.on('transformRow', ({ data }) => {
      console.log('🔀 transformRow received:', data.substring(0, 20))
      setLocal((prev) => {
        console.log('🔀 Current local state:', {
          isStreaming: prev.isStreaming,
          outputLength: prev.output.length,
        })
        return { ...prev, output: prev.output + data + '\n' }
      })
      outputRef.current += `${data}\n`
      console.log('🔀 Updated outputRef length:', outputRef.current.length)
    })

    socket.on('transformComplete', (data) => {
      console.log('✅ transformComplete received:', data)
      setLocal((prev) => {
        return { ...prev, isStreaming: false }
      })
      dispatch(setShapeOutput(outputRef.current))
      dispatch(setTransforming(false))
    })

    socket.on('transformError', (error) => {
      console.log('❌ transformError received:', error)
      setLocal((prev) => ({ ...prev, isStreaming: false }))
      dispatch(setTransformError(error))
      dispatch(setTransforming(false))
    })

    // AI Generation WebSocket events (same pattern as generate)
    socket.on('aiGenerateStart', (data) => {
      console.log('🤖 aiGenerateStart received:', data)
      setLocal({ ...INITAL_STATE, isStreaming: true, totalRows: null, output: '' })
      outputRef.current = ''
      dispatch(setGenerating(true))
      dispatch(setShapeOutput(''))
      dispatch(setStatus('The AI is generating your shape...'))
    })

    socket.on('aiGenerateRow', ({ data }) => {
      console.log('🤖 aiGenerateRow received:', data.substring(0, 20))
      setLocal((prev) => ({ ...prev, output: prev.output + data + '\n' }))
      outputRef.current += `${data}\n`
    })

    socket.on('aiGenerateComplete', (data) => {
      console.log('🤖 aiGenerateComplete received:', data)
      setLocal((prev) => {
        return { ...prev, isStreaming: false }
      })
      dispatch(setShapeOutput(outputRef.current))
      dispatch(setGenerating(false))
      dispatch(setStatus('Successfully generated your shape'))
    })

    socket.on('aiGenerateError', (error) => {
      console.log('❌ aiGenerateError received:', error)
      setLocal((prev) => ({ ...prev, isStreaming: false }))
      dispatch(setGenerateError(error))
      dispatch(setStatus(`Error: ${error}`))
    })

    // clean up, remove when component unmounts
    return () => {
      console.log('did it cancel out?')
      socket.off('generateStart')
      socket.off('generateRow')
      socket.off('generateComplete')
      socket.off('generateError')
      socket.off('transformStart')
      socket.off('transformRow')
      socket.off('transformComplete')
      socket.off('transformError')
      socket.off('aiGenerateStart')
      socket.off('aiGenerateRow')
      socket.off('aiGenerateComplete')
      socket.off('aiGenerateError')
    }
  }, [socket]) // rerun if socket changed

  return (
    <Box
      bg={terminalTheme.colors.retro.contentBg}
      borderRadius="lg"
      border="2px solid"
      borderColor={terminalTheme.colors.retro.border}
      maxH="600px"
      minH="200px"
      overflowY="auto"
    >
      {/* Terminal header */}
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
          <Box w="12px" h="12px" borderRadius="50%" bg="green.500" />
        </HStack>
        <Text
          fontFamily={terminalTheme.fonts.retro}
          fontSize="sm"
          fontWeight="bold"
          color={terminalTheme.colors.retro.text}
        >
          user@ascii-generator: ~$
        </Text>
      </Flex>

      {/* ASCII output */}
      <Box
        fontFamily="'Courier New', 'Courier', monospace"
        color={terminalTheme.colors.retro.text}
        fontSize={getFontSize()}
        px={2}
        py={3}
        lineHeight="1.2"
        overflowX="auto"
        bg={terminalTheme.colors.retro.dottedBg}
        {...terminalTheme.effects.dottedPattern}
      >
        {local.isStreaming ? (
          // During streaming: show each row with fade-in animation
          local.output.split('\n').map((row, index) => (
            <Box key={index} as="div" animation={`${fadeIn} 0.3s ease-out`} whiteSpace="pre">
              {row || '\u00A0'} {/* Non-breaking space for empty lines */}
            </Box>
          ))
        ) : (
          // After streaming complete or no streaming: show full output
          <Box as="pre" whiteSpace="pre">
            {finalShapeOutput || '> Waiting for shape generation...'}
          </Box>
        )}
      </Box>
    </Box>
  )
}
