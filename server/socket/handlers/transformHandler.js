import Grid from '../../../cli/grid.js'

export const transformHandler = socket => {
  console.log('🎧 Transform handler registered for socket:', socket.id)

  socket.on('transformShape', async data => {
    console.log(
      '📥 transformShape received from client:',
      socket.id,
      'transformation:',
      data.transformation
    )
    try {
      const { shape, transformation } = data

      const newGrid = new Grid({ content: shape })
      console.log(newGrid.toString(), 'old grid')

      // applyTransformation returns a NEW grid instance
      const transformedGrid = Grid.applyTransformation(newGrid, transformation)
      console.log(transformedGrid.toString())

      //   // use existing function
      //   const { output: shapeOutput } = Transformer.transform({
      //     grid: newGrid,
      //     transformations: [transformation],
      //   })

      // Attach event listeners BEFORE calling streamRowsWithDelay()
      transformedGrid.on('rowCompleted', ({ rowIndex, data, total }) => {
        socket.emit('transformRow', {
          rowIndex,
          data,
          progress: ((rowIndex + 1) / total) * 100,
        })
      })

      transformedGrid.on('complete', ({ total }) => {
        console.log(
          '🏁 Server emitting transformComplete to socket:',
          socket.id
        )
        socket.emit('transformComplete', {
          totalRows: total,
        })
        console.log('✅ transformComplete emitted successfully')
      })
      console.log('🔄 EMITTING transformStart to socket:', socket.id)
      // Emit start event
      socket.emit('transformStart', {
        totalRows: transformedGrid.height,
        shape: 'transform',
      })
      console.log('🔄 transformStart emitted successfully with totalRows:', transformedGrid.height)

      // Wait 100ms to ensure client has processed transformStart
      await new Promise(resolve => setTimeout(resolve, 100))

      // NOW trigger the events with delay for animation (50ms between rows)
      await transformedGrid.streamRowsWithDelay(50)
      // const rows = shapeOutput.split('\n').filter(r => r)
      // // same code as the shape handler
      //   socket.emit('transformStart', {
      //     totalRows: rows.length,
      //     })
      // // stream row by row
      // for (let i =0; i< rows.length; i++ ) {
      //     socket.emit('transformRow', {
      //         rowIndex: 1,
      //         data: rows[i],
      //         progress: ((i + 1)/rows.length * 100)
      //     })
      //     await new Promise(resolve => setTimeout(resolve, 50))
      // }
      // console.log('🏁 Server emitting transformComplete to socket:', socket.id)
      // socket.emit('transformComplete', {
      //     totalRows: rows.length
      // })
      // console.log('✅ transformComplete emitted successfully')
    } catch (error) {
      console.log('girl what happen', error)
      socket.emit('transformError', {
        message: error.message,
      })
    }
  })
}
