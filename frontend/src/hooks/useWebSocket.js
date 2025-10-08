import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

/**
 * Custom hook for managing WebSocket connection with Socket.IO
 *
 * @param {string} url - The WebSocket server URL (uses VITE_BACKEND_URL env var by default)
 * @returns {Object} - { socket, isConnected }
 *
 * Usage:
 * const { socket, isConnected } = useWebSocket()
 *
 * // Listen for events
 * useEffect(() => {
 *   if (!socket) return
 *   socket.on('eventName', (data) => console.log(data))
 *   return () => socket.off('eventName')
 * }, [socket])
 *
 * // Emit events
 * socket?.emit('eventName', data)
 */
export function useWebSocket(url = WS_URL) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection to:', url)

    // Create socket connection
    const socketInstance = io(url, {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connected:', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason)
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error.message)
      setIsConnected(false)
    })

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts')
    })

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt', attemptNumber)
    })

    socketInstance.on('reconnect_failed', () => {
      console.error('🔴 Reconnection failed after all attempts')
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket')
      socketInstance.disconnect()
    }
  }, [url])

  return { socket, isConnected }
}