import { configureStore } from '@reduxjs/toolkit';
import visualizationReducer from './slices/visualizationSlice';

export const store = configureStore({
  reducer: {
    visualization: visualizationReducer,
  },
});
// Infer `RootState` and `AppDispatch` types from the store itself
export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
