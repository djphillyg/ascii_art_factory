import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export const generateShapeAsync = createAsyncThunk(
    'shapeGenerator/generateShape',
    async (shapeData, {rejectWithValue}) => {
        try {
            const response = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shapeData)
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
        },

        updateOptions: (state, action) => {
            // update the state options with
            // the new options provided
            state.options = {
                ...state.options,
                ...action.payload,
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(generateShapeAsync.pending, (state) => {
            state.isGenerating = true
            state.generateError = null
        })
        .addCase(generateShapeAsync.fulfilled, (state, action) => {
            console.log('this is the action btw', action)
            state.isGenerating = false
            state.currentShapeData = action.payload
        })
        .addCase(generateShapeAsync.rejected, (state, action) => {
            state.isGenerating = false
            state.generateError = action.payload || 'Failed to generate shape'
        })
    }
})

export const selectCurrentShapeType = (state) => state.shapeGenerator.currentShapeType
export const selectCurrentShape = (state) => state.shapeGenerator.currentShape
export const selectOptions = (state) => state.shapeGenerator.options
export const selectIsGenerating = (state) => state.shapeGenerator.isGenerating
export const selectGenerateError = (state) => state.shapeGenerator.generateError

// export actions for use in components
export const { updateOptions, clearCurrentShape, setShape } = shapeGeneratorSlice.actions
// export reducer for store configuration
export default shapeGeneratorSlice.reducer
