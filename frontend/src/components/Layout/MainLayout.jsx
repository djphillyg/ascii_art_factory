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
      {/* Terminal Header Bar */}
      <Box
        as="header"
        bg={terminalTheme.colors.bg.secondary}
        borderBottom="2px solid"
        borderColor={terminalTheme.colors.green[500]}
        boxShadow={terminalTheme.effects.glow.green}
        py={3}
      >
        <Container maxW="container.xl">
          <Box display="flex" alignItems="center" gap={3}>
            {/* Terminal window controls */}
            <Box display="flex" gap={2}>
              <Box w={3} h={3} borderRadius="full" bg={terminalTheme.colors.error} />
              <Box w={3} h={3} borderRadius="full" bg={terminalTheme.colors.warning} />
              <Box w={3} h={3} borderRadius="full" bg={terminalTheme.colors.success} />
            </Box>

            {/* Terminal prompt */}
            <Text
              color={terminalTheme.colors.green[500]}
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="bold"
              textShadow={terminalTheme.effects.textGlow.green}
            >
              user@ascii-generator:~$
            </Text>

            <Text
              color={terminalTheme.colors.cyan[500]}
              fontSize={{ base: 'sm', md: 'md' }}
              ml="auto"
            >
              [CONNECTED]
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Main Terminal Content */}
      <Container
        maxW="container.xl"
        py={{ base: 4, md: 6 }}
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
