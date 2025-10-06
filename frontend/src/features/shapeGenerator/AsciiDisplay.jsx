import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, Text } from '@chakra-ui/react'
import { selectShapeOutput } from './shapeGeneratorSlice'

  export default function AsciiDisplay({ socket }) {
    const shapeOutput = useSelector(selectShapeOutput)

    const INITAL_STATE = {
      output: '',
      isStreaming: false,
      error: null,
      totalRows: null,
    }

    const [local, setLocal] = useState(INITAL_STATE)

    const finalShapeOutput = shapeOutput || local.output

    useEffect(() => {
      if (!socket) return
      socket.on('generateStart', ({ totalRows }) => {
        setLocal({...INITAL_STATE, isStreaming: true, totalRows})
      })

      socket.on('generateRow', ({ data}) => {
        // concat the joined row to the local
        setLocal((prev) => ({...prev, output: prev.output + data+'\n'}))
      })

      socket.on('generateComplete', () => {
        setLocal(prev => ({...prev, isStreaming: false}))
      })
      // clean up, remove when component unmounts
      return () => {
        socket.off('generateStart')
        socket.off('generateRow')
        socket.off('generateComplete')
        socket.off('generateError')
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
          as="pre"
          fontFamily="'Courier New', 'Courier', monospace"
          color="green.400"
          fontSize={{ base: 'xs', md: 'sm' }}
          lineHeight="1.2"
          whiteSpace="pre"
          overflowX="auto"
        >
          {finalShapeOutput || '> Waiting for shape generation...'}
        </Box>
      </Box>
    )
  }