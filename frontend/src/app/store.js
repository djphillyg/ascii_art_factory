import { configureStore } from '@reduxjs/toolkit';
import shapesReducer from '@/features/shapes/shapesSlice';
import shapeGeneratorReducer from '@/features/shapeGenerator/shapeGeneratorSlice';
// Import more slices here as you create them
// import historyReducer from '@/features/history/historySlice';

export const store = configureStore({
  reducer: {
    /**
     * every single one of the slices need to end up here
     * to manage their own store and service and what not
     * doesnt matter that shapes and shapesGenerator share because
     * you can pull from either one
     */
    shapes: shapesReducer,
    shapeGenerator: shapeGeneratorReducer,
    // Add more reducers here
    // history: historyReducer,
  },
  // Middleware is automatically included (thunk, devtools)
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development only
});

// Export types for TypeScript (optional, but good practice for JSDoc)
export default store;