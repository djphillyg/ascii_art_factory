import { createSlice } from '@reduxjs/toolkit'

/**
 * Mode Slice
 *
 * Manages the application mode state (manual vs AI generation)
 */

const initialState = {
  currentMode: 'manual', // 'manual' | 'ai'
}

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.currentMode = action.payload
    },
    toggleMode: (state) => {
      state.currentMode = state.currentMode === 'manual' ? 'ai' : 'manual'
    },
  },
})

export const { setMode, toggleMode } = modeSlice.actions

// Selectors
export const selectCurrentMode = (state) => state.mode.currentMode
export const selectIsManualMode = (state) => state.mode.currentMode === 'manual'
export const selectIsAiMode = (state) => state.mode.currentMode === 'ai'

export default modeSlice.reducer
