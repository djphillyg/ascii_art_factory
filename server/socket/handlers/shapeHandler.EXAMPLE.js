// EXAMPLE IMPLEMENTATION - NOT ACTUAL CODE
// This shows how to refactor shapeHandler to use Grid EventEmitter directly

import Grid from '../../../cli/grid.js'

export const shapeHandler = (socket) => {
  socket.on('generateShape', async (data) => {
    try {
      const { type, options } = data

      // STEP 1: Instead of using generate(), call Grid static methods directly
      // This gives us back the Grid instance (which extends EventEmitter)
      let grid

      if (type === 'circle') {
        grid = Grid.generateCircle(options)
      } else if (type === 'rectangle') {
        grid = Grid.generateRectangle(options)
      } else if (type === 'polygon') {
        grid = Grid.generatePolygon(options)
      } else if (type === 'text') {
        grid = Grid.createText(options)
      } else {
        throw new Error(`Unknown type: ${type}`)
      }

      // STEP 2: Listen to 'rowCompleted' events from the Grid instance
      // These are emitted during streamRowsV1() inside each generator
      grid.on('rowCompleted', ({ rowIndex, data, total }) => {
        // STEP 3: Forward the Grid event to the WebSocket client
        socket.emit('generateRow', {
          rowIndex,
          data,
          progress: ((rowIndex + 1) / total) * 100,
        })
      })

      // STEP 4: Listen to 'complete' event from Grid
      grid.on('complete', ({ total }) => {
        // STEP 5: Forward completion to WebSocket client
        socket.emit('generateComplete', {
          totalRows: total,
          output: grid.toString(), // Send final grid if needed
        })
      })

      // STEP 6: Optionally emit a start event
      socket.emit('generateStart', {
        shape: type,
        totalRows: grid.height,
      })

      // NOTE: The events will fire synchronously because streamRowsV1()
      // is called inside the static methods (generateCircle, etc.)
      // All events will have already fired by this point!

    } catch (error) {
      socket.emit('generateError', {
        message: error.message,
      })
    }
  })

  socket.on('cancel-generation', () => {
    console.log('Generation cancelled by client')
    // TODO: Would need to refactor Grid generators to support cancellation
    // Could check a flag inside the generation loops
  })
}

// ALTERNATIVE: If you want to keep the generate() abstraction but return Grid instance
// You would need to modify generator.js to NOT call ShapeGenerator.create()
// Instead, it should call Grid static methods directly and return the Grid instance

// generator.js would look like:
/*
export function generate(type, options) {
  if (type === 'circle') {
    return Grid.generateCircle(options)
  } else if (type === 'rectangle') {
    return Grid.generateRectangle(options)
  } else if (type === 'polygon') {
    return Grid.generatePolygon(options)
  } else if (type === 'text') {
    return Grid.createText(options)
  }
  throw new Error(`Unknown type: ${type}`)
}
*/

// Then shapeHandler would be:
/*
export const shapeHandler = (socket) => {
  socket.on('generateShape', async (data) => {
    const { type, options } = data

    // generate() now returns Grid instance instead of { grid, output }
    const grid = generate(type, options)

    grid.on('rowCompleted', (rowData) => {
      socket.emit('generateRow', rowData)
    })

    grid.on('complete', (completeData) => {
      socket.emit('generateComplete', completeData)
    })
  })
}
*/
