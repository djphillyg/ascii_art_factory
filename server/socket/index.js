// const shapeHandler = require('./handlers/shapeHandler');
import { shapeHandler } from './handlers/shapeHandler.js'
import { transformHandler } from './handlers/transformHandler.js'
import { aiHandler } from './handlers/aiHandler.js'
// const textHandler = require('./handlers/textHandler');
import { Server } from 'socket.io'

export let io

export const initSocket = (server, port) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Your frontend URL
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', socket => {
    console.log('Client connected:', socket.id)

    // Register handlers
    shapeHandler(socket)
    transformHandler(socket)
    aiHandler(socket)

    // textHandler(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  server.listen(port || 3001, () => {
    console.log(`Server (HTTP + WebSocket) running on port ${port}`)
  })
  return io
}
