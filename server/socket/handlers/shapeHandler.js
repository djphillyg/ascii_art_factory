import { generate as generateShape } from '../../../cli/generator.js';
export const shapeHandler = (socket) => {
    socket.on('generateShape', async (data) => {
        try {
            const { type, options } = data

            // use existing function
            const { output: shapeOutput} = generateShape(type, options)
            const rows = shapeOutput.split('\n').filter(r => r)

            socket.emit('generateStart', {
                totalRows: rows.length,
                shape: type
            })
            // stream row by row
            for (let i =0; i< rows.length; i++ ) {
                socket.emit('generateRow', {
                    rowIndex: 1,
                    data: rows[i],
                    progress: ((i + 1)/rows.length * 100)
                })
            }

            socket.emit('generateComplete', {
                totalRows: rows.length
            })
        } catch (error) {
            socket.emit('generateError', {
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