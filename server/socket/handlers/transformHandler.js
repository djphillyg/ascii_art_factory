import Transformer from '../../../cli/transformer.js'
import Grid from '../../../cli/grid.js'

export const transformHandler = (socket) => {
    socket.on('transformShape', async (data) => {
        try {
            const { shape, transformation } = data

            const newGrid = new Grid({content: shape})

            // use existing function
            const { output: shapeOutput } = Transformer.transform({
                grid: newGrid,
                transformations: [transformation]
            })
            const rows = shapeOutput.split('\n').filter(r => r)
            // same code as the shape handler
              socket.emit('transformStart', {
                totalRows: rows.length,
                })
            // stream row by row
            for (let i =0; i< rows.length; i++ ) {
                socket.emit('transformRow', {
                    rowIndex: 1,
                    data: rows[i],
                    progress: ((i + 1)/rows.length * 100)
                })
                await new Promise(resolve => setTimeout(resolve, 50))
            }
            console.log('🏁 Server emitting transformComplete to socket:', socket.id)
            socket.emit('transformComplete', {
                totalRows: rows.length
            })
            console.log('✅ transformComplete emitted successfully')
        } catch (error) {
            socket.emit('transformError', {
                message: error.message
            })
        }
    })
}