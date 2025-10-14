import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/apiConfig';

// ===================================
// ASYNC THUNKS
// ===================================
// Thunks handle async operations (API calls)
// They automatically dispatch pending/fulfilled/rejected actions

/**
 * Fetch available shapes metadata from the API
 * Returns list of available shapes with parameters and examples
 */
export const fetchShapes = createAsyncThunk(
  'shapes/fetchShapes', // Action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/shapes`);
      if (!response.ok) {
        throw new Error('Failed to fetch shapes');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Generate a shape by calling the API
 * @param {Object} shapeData - Shape configuration {type, options}
 */
export const generateShape = createAsyncThunk(
  'shapes/generateShape',
  async (shapeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shapeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate shape');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================================
// INITIAL STATE
// ===================================
const initialState = {
  // Available shapes from API
  availableShapes: [],
  availableTypes: [],
  fillPatterns: [],
  directions: [],

  // Currently selected/generated shape
  currentShape: null,

  // Loading states (one per async operation)
  isLoadingShapes: false,
  isGenerating: false,

  // Error states
  error: null,
  generateError: null,
};

// ===================================
// SLICE
// ===================================
// Slice combines reducers and actions in one place
// Redux Toolkit uses Immer, so you can "mutate" state directly

const shapesSlice = createSlice({
  name: 'shapes',
  initialState,

  // SYNCHRONOUS REDUCERS
  // These handle state changes that don't require API calls
  reducers: {
    /**
     * Clear the currently generated shape
     */
    clearCurrentShape: (state) => {
      state.currentShape = null;
      state.generateError = null;
    },

    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      state.error = null;
      state.generateError = null;
    },
  },

  // ASYNC REDUCERS
  // These handle the lifecycle of async operations
  extraReducers: (builder) => {
    builder
      // ===== FETCH SHAPES =====
      .addCase(fetchShapes.pending, (state) => {
        state.isLoadingShapes = true;
        state.error = null;
      })
      .addCase(fetchShapes.fulfilled, (state, action) => {
        state.isLoadingShapes = false;
        state.availableShapes = action.payload.shapes || [];
        state.availableTypes = action.payload.availableTypes || [];
        state.fillPatterns = action.payload.fillPatterns || [];
        state.directions = action.payload.directions || [];
      })
      .addCase(fetchShapes.rejected, (state, action) => {
        state.isLoadingShapes = false;
        state.error = action.payload || 'Failed to load shapes';
      })

      // ===== GENERATE SHAPE =====
      .addCase(generateShape.pending, (state) => {
        state.isGenerating = true;
        state.generateError = null;
      })
      .addCase(generateShape.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.currentShape = action.payload;
      })
      .addCase(generateShape.rejected, (state, action) => {
        state.isGenerating = false;
        state.generateError = action.payload || 'Failed to generate shape';
      });
  },
});

// ===================================
// SELECTORS
// ===================================
// Selectors extract specific pieces of state
// They keep components simple and enable memoization with Reselect

export const selectAvailableShapes = (state) => state.shapes.availableShapes;
export const selectAvailableTypes = (state) => state.shapes.availableTypes;
export const selectFillPatterns = (state) => state.shapes.fillPatterns;
export const selectDirections = (state) => state.shapes.directions;
export const selectCurrentShape = (state) => state.shapes.currentShape;
export const selectIsLoadingShapes = (state) => state.shapes.isLoadingShapes;
export const selectIsGenerating = (state) => state.shapes.isGenerating;
export const selectError = (state) => state.shapes.error;
export const selectGenerateError = (state) => state.shapes.generateError;

// ===================================
// EXPORTS
// ===================================
// Export actions for use in components
export const { clearCurrentShape, clearErrors } = shapesSlice.actions;

// Export reducer for store configuration
export default shapesSlice.reducer;