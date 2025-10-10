
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  selectShapeOutput,
  setGenerating,
  setShapeOutput,
  setGenerateError,
  setTransforming,
  setTransformError,
} from './shapeGeneratorSlice'

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
      ? Math.max(...finalShapeOutput.split('\n').map(line => line.length))
      : 0

    const getFontSize = () => {
      if (maxLineLength > 120) return 'xs'
      if (maxLineLength > 80) return 'sm'
      return 'md'
    }

    useEffect(() => {
      if (!socket) return

      console.log('🎧 Setting up socket listeners...')

      socket.on('generateStart', ({ totalRows }) => {
        console.log('🟢 generateStart received:', totalRows)
        setLocal({...INITAL_STATE, isStreaming: true, totalRows, output: ''})
        outputRef.current = ''
        // we need to sync the state to the async thunk
        dispatch(setGenerating(true))
        dispatch(setShapeOutput(''))
      })

      socket.on('generateRow', ({ data}) => {
        console.log('📊 generateRow received:', data.substring(0, 20))
        // concat the joined row to the local
        setLocal((prev) => ({...prev, output: prev.output + data +'\n'}))
        outputRef.current += `${data}\n`
      })

      socket.on('generateComplete', (data) => {
        console.log('🏁 generateComplete received:', data)
        setLocal(prev => {
          return {...prev, isStreaming: false}
        })
          dispatch(setShapeOutput(outputRef.current))
          dispatch(setGenerating(false))
      })

      socket.on('generateError', (error) => {
        setLocal(prev => ({...prev, isStreaming: false}))
        dispatch(setGenerateError(error))
      })

      // Transform WebSocket events (same pattern as generate)
      socket.on('transformStart', ({ totalRows }) => {
        console.log('🔄 transformStart received:', totalRows)
        setLocal({...INITAL_STATE, isStreaming: true, totalRows, output: ''})
        outputRef.current = ''
        dispatch(setTransforming(true))
        dispatch(setShapeOutput(''))
      })

      socket.on('transformRow', ({ data }) => {
        console.log('🔀 transformRow received:', data.substring(0, 20))
        setLocal((prev) => ({...prev, output: prev.output + data + '\n'}))
        outputRef.current += `${data}\n`
      })

      socket.on('transformComplete', (data) => {
        console.log('✅ transformComplete received:', data)
        setLocal(prev => {
          return {...prev, isStreaming: false}
        })
        dispatch(setShapeOutput(outputRef.current))
        dispatch(setTransforming(false))
      })

      socket.on('transformError', (error) => {
        console.log('❌ transformError received:', error)
        setLocal(prev => ({...prev, isStreaming: false}))
        dispatch(setTransformError(error))
        dispatch(setTransforming(false))
      })

      // clean up, remove when component unmounts
      return () => {
        socket.off('generateStart')
        socket.off('generateRow')
        socket.off('generateComplete')
        socket.off('generateError')
        socket.off('transformStart')
        socket.off('transformRow')
        socket.off('transformComplete')
        socket.off('transformError')
      }
    }, [socket]) // rerun if socket changed



    // TODO: WebSocket Streaming Implementation
    // 1. Add local state: useState({ rows: [], isStreaming: false, error: null })
    // 2. useEffect to listen for socket events:
    //    - socket.on('generation-start', ({ totalRows }) => clear state, set isStreaming true)
    //    - socket.on('shape-row', ({ rowIndex, data, progress }) => append row to state array)
    //    - socket.on('generation-complete', () => set isStreaming false, optionally save to Redux)
    //    - socket.on('generation-error', ({ message }) => set error state)
        // if there is a socket, we will set up hooks for the socket
    // 3. Cleanup: return () => socket.off('generation-start', 'shape-row', 'generation-complete', 'generation-error')
    // 4. Display: streaming rows (join with '\n') OR Redux state (streaming takes precedence)
    // 5. Show progress indicator using progress value from shape-row events

    return (
      <Box
        bg="gray.900"
        p={6}
        borderRadius="lg"
        boxShadow="0 0 30px rgba(0, 255, 0, 0.2)"
        border="2px solid"
        borderColor="green.800"
        maxH="600px"
        overflowY="auto"
      >
        {/* Terminal header */}
        <Box mb={4} display="flex" gap={2}>
          <Box w={3} h={3} borderRadius="full" bg="red.500" />
          <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
          <Box w={3} h={3} borderRadius="full" bg="green.500" />
          <Text ml={4} fontSize="xs" color="green.600">
            ASCII Art Generator
          </Text>
        </Box>

        {/* ASCII output */}
        <Box
          fontFamily="'Courier New', 'Courier', monospace"
          color="green.400"
          fontSize={getFontSize()}
          lineHeight="1.2"
          overflowX="auto"
        >
          {local.isStreaming ? (
            // During streaming: show each row with fade-in animation
            local.output.split('\n').map((row, index) => (
              <Box
                key={index}
                as="div"
                animation={`${fadeIn} 0.3s ease-out`}
                whiteSpace="pre"
              >
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