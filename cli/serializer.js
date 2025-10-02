import {gridOutputToString} from './renderer'

export class OutputSerializer {
    constructor(grid, metadata) {
        this.grid = grid
        this.metadata = metadata
    }

    toJSON() {
        return {
            ...this.metadata,
            grid: this.grid,
            timestamp: new Date().toISOString(),
        }
    }

    toASCII() {
        return gridOutputToString(this.grid)
    }

    toHTML() {
        return this.grid.map(row => `${row.map(char => `<span>${char}</span>`).join('')}<br>`).join('')
    }
}