import { Box, Container, Heading, Text } from '@chakra-ui/react'

/**
 * MainLayout - Responsive layout wrapper
 *
 * Chakra's responsive props work with breakpoint syntax:
 * - base: mobile (default, 0px+)
 * - sm: 480px+
 * - md: 768px+
 * - lg: 992px+
 * - xl: 1280px+
 *
 * You can pass arrays or objects for responsive values:
 * - Array: [base, sm, md, lg, xl]
 * - Object: { base: value, md: value }
 */
export default function MainLayout({ children }) {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
    >
      {/* Header */}
      <Box
        as="header"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        py={4}
      >
        <Container maxW="container.xl">
          <Heading
            as="h1"
            size={{ base: 'lg', md: 'xl' }}
            mb={1}
          >
            ASCII Shape Generator
          </Heading>
          <Text
            color="gray.600"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            Build beautiful ASCII art with React + Redux
          </Text>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container
        maxW="container.xl"
        py={{ base: 4, md: 8 }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Box
        as="footer"
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        py={4}
        mt="auto"
      >
        <Container maxW="container.xl">
          <Text
            textAlign="center"
            color="gray.600"
            fontSize="sm"
          >
            Built with Vite + React + Redux Toolkit + Chakra UI
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
