import Grid from '../../cli/grid.js'
import { recipeSchema } from '../validation/schemas/recipe.js'

class RecipeExecutor {
  constructor() {
    // storage for immediate grids during recipe execution
    this.gridStore = new Map()
  }

  execute(recipe) {
    console.log(JSON.stringify(recipe), 'this is the recipe')
    // validate recipe structure
    this.validateRecipe(recipe)

    // clear prev exec state
    this.gridStore.clear()
    // execute each op in sequence
    for (const operation of recipe.recipe) {
      this.executeOperation(operation)
    }
    // return final output grid
    const outputGrid = this.gridStore.get(recipe.output)
    if (!outputGrid) {
      throw new Error(`Output grid: ${recipe.output} not found`)
    }
    return outputGrid
  }

  executeOperation(operation) {
    switch (operation.operation) {
      case 'generate':
        return this.executeGenerate(operation)
      case 'overlay':
        return this.executeOverlay(operation)
      case 'clip':
        return this.executeClip(operation)
      case 'transform':
        return this.executeTransform(operation)
      case 'topAppend':
        return this.executeTopAppend(operation)
      case 'bottomAppend':
        return this.executeBottomAppend(operation)
      case 'centerHorizontally':
        return this.executeCenterHorizontally(operation)
      default:
        // this should never get hit, validator should have caught it
        throw new Error(`Unknown operation: ${operation.operation}`)
    }
  }

  executeGenerate(operation) {
    const { shape, params, storeAs } = operation
    let grid

    switch (shape) {
      case 'circle':
        grid = Grid.generateCircle(params)
        break
      case 'rectangle':
        grid = Grid.generateRectangle(params)
        break
      case 'polygon':
        grid = Grid.generatePolygon(params)
        break
      case 'text':
        grid = Grid.createText(params)
        break
      default:
        throw new Error(`Unknown shape: ${shape}`)
    }
    this.gridStore.set(storeAs, grid)
  }

  executeOverlay(operation) {
    const { target, source, position, transparent = true, storeAs } = operation

    const targetGrid = this.gridStore.get(target)
    const sourceGrid = this.gridStore.get(source)

    if (!targetGrid) {
      throw new Error(`Target grid: ${target} not found`)
    }
    if (!sourceGrid) {
      throw new Error(`Source grid: ${source} not found`)
    }
    // overlay modifies target in place
    targetGrid.overlay(sourceGrid, {
      row: position.row,
      col: position.col,
      transparent,
    })
    this.gridStore.set(storeAs, new Grid({ content: targetGrid.toString() }))
  }

  executeClip(operation) {
    const { source, bounds, storeAs } = operation

    const sourceGrid = this.gridStore.get(source)
    if (!sourceGrid) {
      throw new Error(`Source grid ${source} not found`)
    }

    const clippedGrid = sourceGrid.clip(bounds)
    this.gridStore.set(storeAs, clippedGrid)
  }

  executeTransform(operation) {
    const { source, type, params, storeAs } = operation

    const sourceGrid = this.gridStore.get(source)
    if (!sourceGrid) {
      throw new Error(`Source grid ${source} not found`)
    }
    const transformedGrid = Grid.applyTransformation(sourceGrid, {
      type,
      params,
    })
    this.gridStore.set(storeAs, transformedGrid)
  }

  executeTopAppend(operation) {
    const { target, source, storeAs } = operation

    const targetGrid = this.gridStore.get(target)
    const sourceGrid = this.gridStore.get(source)

    if (!targetGrid) {
      throw new Error(`Target grid: ${target} not found`)
    }
    if (!sourceGrid) {
      throw new Error(`Source grid: ${source} not found`)
    }

    // topAppend puts source on top of target
    const resultGrid = targetGrid.topAppend(sourceGrid)
    this.gridStore.set(storeAs, resultGrid)
  }

  executeBottomAppend(operation) {
    const { target, source, storeAs } = operation

    const targetGrid = this.gridStore.get(target)
    const sourceGrid = this.gridStore.get(source)

    if (!targetGrid) {
      throw new Error(`Target grid: ${target} not found`)
    }
    if (!sourceGrid) {
      throw new Error(`Source grid: ${source} not found`)
    }

    // bottomAppend puts source on bottom of target
    const resultGrid = targetGrid.bottomAppend(sourceGrid)
    this.gridStore.set(storeAs, resultGrid)
  }

  executeCenterHorizontally(operation) {
    const { source, targetWidth, storeAs } = operation

    const sourceGrid = this.gridStore.get(source)
    if (!sourceGrid) {
      throw new Error(`Source grid: ${source} not found`)
    }

    const centeredGrid = sourceGrid.centerHorizontally(targetWidth)
    this.gridStore.set(storeAs, centeredGrid)
  }

  validateRecipe(recipe) {
    recipeSchema.validate(recipe)
  }
}

export default RecipeExecutor
