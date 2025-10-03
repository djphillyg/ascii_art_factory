import { configureStore } from '@reduxjs/toolkit';
import shapesReducer from '@/features/shapes/shapesSlice';
// Import more slices here as you create them
// import historyReducer from '@/features/history/historySlice';

export const store = configureStore({
  reducer: {
    shapes: shapesReducer,
    // Add more reducers here
    // history: historyReducer,
  },
  // Middleware is automatically included (thunk, devtools)
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development only
});

// Export types for TypeScript (optional, but good practice for JSDoc)
export default store;