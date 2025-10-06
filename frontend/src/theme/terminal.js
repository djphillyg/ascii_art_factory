/**
 * Terminal Theme Configuration
 *
 * Cyberpunk/Matrix-inspired color scheme for ASCII art generator
 */

export const terminalTheme = {
  colors: {
    // Background layers
    bg: {
      primary: '#0a0e27',      // Deep dark blue-black
      secondary: '#1a1d2e',    // Slightly lighter panel bg
      tertiary: '#252836',     // Input/card backgrounds
    },

    // Terminal green (Matrix style)
    green: {
      50: '#e6fff0',
      100: '#b3ffd6',
      200: '#80ffbd',
      300: '#4dffa3',
      400: '#1aff8a',
      500: '#00ff41',          // Primary terminal green
      600: '#00cc34',
      700: '#009926',
      800: '#006619',
      900: '#00330d',
    },

    // Neon cyan (accent)
    cyan: {
      50: '#e6fbff',
      100: '#b3f3ff',
      200: '#80ebff',
      300: '#4de3ff',
      400: '#1adbff',
      500: '#00d9ff',          // Primary neon cyan
      600: '#00aecc',
      700: '#008299',
      800: '#005766',
      900: '#002b33',
    },

    // Purple accent
    purple: {
      500: '#7b61ff',
      600: '#6247ff',
    },

    // Grays
    gray: {
      800: '#1f2937',
      700: '#374151',
      600: '#4b5563',
      500: '#6b7280',
      400: '#9ca3af',
    },

    // Status colors
    error: '#ff4757',
    warning: '#ffa502',
    success: '#00ff41',
  },

  effects: {
    // Glowing borders
    glow: {
      green: '0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.3)',
      cyan: '0 0 10px rgba(0, 217, 255, 0.5), 0 0 20px rgba(0, 217, 255, 0.3)',
      greenStrong: '0 0 20px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.5)',
    },

    // Text shadows for CRT effect
    textGlow: {
      green: '0 0 5px rgba(0, 255, 65, 0.7)',
      cyan: '0 0 5px rgba(0, 217, 255, 0.7)',
    },
  },

  fonts: {
    mono: '"Courier New", "Courier", "Monaco", "Menlo", monospace',
  },
}