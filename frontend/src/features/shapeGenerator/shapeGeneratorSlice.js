import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export function gridOutputToString(gridArray) {
  return gridArray.map((line) => line.join('')).join('\n')
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export const transformShapeAsync = createAsyncThunk(
  'shapeGenerator/transformShape',
  async ({ shape, transformation }) => {
    const response = await fetch(`${API_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shape,
        transformation,
      }),
    })
    if (!response.ok) {
      throw new Error('Transformation failed')
    }

    const data = await response.json()
    return data.output
  }
)

export const generateShapeAsync = createAsyncThunk(
  'shapeGenerator/generateShape',
  async (shapeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shapeData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate shape')
      }

      return response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// initial state
const initialState = {
  currentShapeType: null,
  currentShapeData: null,
  options: {},
  isGenerating: false,
  error: null,
  generateError: null,
  shapeOutput: null,
  // transform panel
  transformedShapeOutput: null,
  isTransforming: false,
  transformError: null,
}

const shapeGeneratorSlice = createSlice({
  name: 'shapeGenerator',
  initialState,
  reducers: {
    setShape: (state, action) => {
      state.currentShapeType = action.payload
      state.options = {}
    },
    // is there a way to straight reset it for the initial state ?

    clearCurrentShape: (state) => {
      state.currentShapeType = null
      state.currentShapeData = null
      state.options = {}
      state.shapeOutput = null
    },

    updateOptions: (state, action) => {
      // update the state options with
      // the new options provided
      state.options = {
        ...state.options,
        ...action.payload,
      }
    },
    // websocket state actions
    setGenerating: (state, action) => {
      state.isGenerating = action.payload
    },
    setShapeOutput: (state, action) => {
      state.shapeOutput = action.payload
    },
    setGenerateError: (state, action) => {
      state.generateError = action.payload
    },
    setTransforming: (state, action) => {
      state.isTransforming = action.payload
    },
    setTransformError: (state, action) => {
      state.transformError = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // tranform shape reduce
      .addCase(transformShapeAsync.pending, (state) => {
        state.isTransforming = true
        state.transformError = null
      })
      .addCase(transformShapeAsync.fulfilled, (state, action) => {
        state.isTransforming = false
        state.transformError = null
        state.shapeOutput = action.payload
      })
      .addCase(transformShapeAsync.rejected, (state, action) => {
        state.isTransforming = false
        state.transformError = action.payload || 'Failed to transform shape'
      })
      // generate shape extra reducers
      .addCase(generateShapeAsync.pending, (state) => {
        state.isGenerating = true
        state.generateError = null
        state.shapeOutput = null
      })
      .addCase(generateShapeAsync.fulfilled, (state, action) => {
        state.isGenerating = false
        state.currentShapeData = action.payload
        state.shapeOutput = gridOutputToString(action.payload.grid)
      })
      .addCase(generateShapeAsync.rejected, (state, action) => {
        state.isGenerating = false
        state.generateError = action.payload || 'Failed to generate shape'
      })
  },
})

export const selectCurrentShapeType = (state) => state.shapeGenerator.currentShapeType
export const selectCurrentShape = (state) => state.shapeGenerator?.currentShape
export const selectOptions = (state) => state.shapeGenerator.options
export const selectIsGenerating = (state) => state.shapeGenerator.isGenerating
export const selectGenerateError = (state) => state.shapeGenerator.generateError
export const selectShapeOutput = (state) => state.shapeGenerator.shapeOutput
export const selectIsTransforming = (state) => state.shapeGenerator.isTransforming
export const selectTransformError = (state) => state.shapeGenerator.transformError
// export actions for use in components
export const {
  updateOptions,
  clearCurrentShape,
  setShape,
  setGenerating,
  setShapeOutput,
  setGenerateError,
  setTransforming,
  setTransformError,
} = shapeGeneratorSlice.actions
// export reducer for store configuration
export default shapeGeneratorSlice.reducer
