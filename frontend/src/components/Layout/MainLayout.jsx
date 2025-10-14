import { Box, Container, Text } from '@chakra-ui/react'
import { terminalTheme } from '../../theme/terminal'

/**
 * MainLayout - Terminal-themed layout wrapper
 *
 * Full terminal immersion with CRT-style header and dark background
 */
export default function MainLayout({ children }) {
  return (
    <Box
      minH="100vh"
      bg={terminalTheme.colors.bg.primary}
      fontFamily={terminalTheme.fonts.mono}
    >
      {/* Main Content */}
      <Container
        maxW="container.xl"
        py={{ base: 4, md: 6 }}
        px={{ base: 4, md: 6 }}
      >
        {children}
      </Container>

      {/* Terminal Footer */}
      <Box
        as="footer"
        bg={terminalTheme.colors.bg.secondary}
        borderTop="1px solid"
        borderColor={terminalTheme.colors.green[900]}
        py={3}
        mt="auto"
      >
        <Container maxW="container.xl">
          <Text
            textAlign="center"
            color={terminalTheme.colors.gray[500]}
            fontSize="xs"
            fontFamily={terminalTheme.fonts.mono}
          >
            &gt; SYSTEM READY | Vite + React + Redux + Socket.IO | Press CTRL+C to exit
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
