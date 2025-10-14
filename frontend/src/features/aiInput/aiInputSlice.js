import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * AI Input Slice
 *
 * Manages state for AI-powered ASCII art generation from natural language prompts
 */

const initialState = {
  prompt: '',
  output: null,
  status: 'Ready to generate ASCII art from your description...',
  isGenerating: false,
  error: null,
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export const generateShapeAISync = createAsyncThunk('aiInput/generateShape', async ({ prompt }) => {
  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
    }),
  })
  if (!response.ok) {
    throw new Error('Transformation failed')
  }

  const data = await response.json()
  return data.output
})

const aiInputSlice = createSlice({
  name: 'aiInput',
  initialState,
  reducers: {
    setPrompt: (state, action) => {
      state.prompt = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setGenerating: (state, action) => {
      state.isGenerating = action.payload
      if (action.payload) {
        state.status = 'Generating ASCII art from your prompt...'
      }
    },
    setError: (state, action) => {
      state.error = action.payload
      state.status = `Error: ${action.payload}`
      state.isGenerating = false
    },
    resetAiInput: (state) => {
      state.prompt = ''
      state.status = 'Ready to generate ASCII art from your description...'
      state.isGenerating = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateShapeAISync.pending, (state) => {
        state.isGenerating = true
        state.error = null
        state.status = 'AI is generating your shape'
      })
      .addCase(generateShapeAISync.fulfilled, (state, action) => {
        state.isTransforming = false
        state.error = null
        state.output = action.payload
      })
      .addCase(generateShapeAISync.rejected, (state, action) => {
        state.isGenerating = false
        state.error = action.payload || 'Failed to generate ai shape'
      })
  },
})

export const { setPrompt, setStatus, setGenerating, setError, resetAiInput } = aiInputSlice.actions

// Selectors
export const selectPrompt = (state) => state.aiInput.prompt
export const selectStatus = (state) => state.aiInput.status
export const selectIsGenerating = (state) => state.aiInput.isGenerating
export const selectError = (state) => state.aiInput.error
export const selectOutput = (state) => state.aiInput.output

export default aiInputSlice.reducer
