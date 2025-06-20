import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VisualizationState {
  modelColor: string;
  modelScale: number;
  hoveredIndex: number | null;
}

// Define initial state
const initialState: VisualizationState = {
  modelColor: '#ff7f50',
  modelScale: 1.0,
  hoveredIndex: null,
};

export const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    setColor: (state, action: PayloadAction<string>) => {
      state.modelColor = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.modelScale = action.payload;
    },
    setHoveredIndex: (state, action: PayloadAction<number | null>) => {
      state.hoveredIndex = action.payload;
    },
  },
});

export const { setColor, setScale, setHoveredIndex } =
  visualizationSlice.actions;

export default visualizationSlice.reducer;
