/**
 * API Configuration
 *
 * In production (deployed), uses same origin (relative path)
 * In development, uses VITE_BACKEND_URL env var or defaults to localhost:3001
 */
export const API_URL = import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3001')