import { generateV2 } from '../../../cli/generator.js'

export const shapeHandler = (socket) => {
  socket.on('generateShape', async (data) => {
    try {
      const { type, options } = data

      // Get the Grid instance (events haven't fired yet)
      const grid = generateV2(type, options)

      // Attach event listeners BEFORE calling streamRowsWithDelay()
      grid.on('rowCompleted', ({ rowIndex, data, total }) => {
        socket.emit('generateRow', {
          rowIndex,
          data,
          progress: ((rowIndex + 1) / total) * 100,
        })
      })

      grid.on('complete', ({ total }) => {
        console.log('🏁 Server emitting generateComplete to socket:', socket.id)
        socket.emit('generateComplete', {
          totalRows: total,
        })
        console.log('✅ generateComplete emitted successfully')
      })

      // Emit start event
      socket.emit('generateStart', {
        totalRows: grid.height,
        shape: type,
      })

      // NOW trigger the events with delay for animation (50ms between rows)
      await grid.streamRowsWithDelay(50)
    } catch (error) {
      socket.emit('generateError', {
        message: error.message,
      })
    }
  })

  // Add cancel handler
  socket.on('cancel-generation', () => {
    console.log('Generation cancelled by client')
    // You can add cancellation logic here
  })
}