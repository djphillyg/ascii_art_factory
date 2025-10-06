  import { Box, Text } from '@chakra-ui/react'
  import {useSelector } from 'react-redux'
  import {selectShapeOutput} from './shapeGeneratorSlice'

  export default function AsciiDisplay() {
    const shapeOutput = useSelector(selectShapeOutput)
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
          {shapeOutput || '> Waiting for shape generation...'}
        </Box>
      </Box>
    )
  }