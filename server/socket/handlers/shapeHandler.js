import { generate as generateShape } from '../../../cli/generator.js';
export const shapeHandler = (socket) => {
    socket.on('generate-shape', async (data) => {
        try {
            const { type, options } = data

            // use existing function
            const { output: shapeOutput} = generateShape(type, options)
            const rows = shapeOutput.put.split('\n').filter(r => r)

            socket.emit('generation-start', {
                totalRows: rows.length,
                shape: type
            })
            // stream row by row
            for (let i =0; i< rows.length; i++ ) {
                socket.emit('shape-row', {
                    rowIndex: 1,
                    data: rows[i],
                    progress: ((i + 1)/rows.length * 100)
                })
            }

            socket.emit('generation-complete', {
                totalRows: rows.length
            })
        } catch (error) {
            socket.emit('generation-error', {
                message: error.message
            })
        }
    })
  // Add cancel handler
  socket.on('cancel-generation', () => {
    console.log('Generation cancelled by client');
    // You can add cancellation logic here
  });
}