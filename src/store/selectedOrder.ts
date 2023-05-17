import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

export const selectedOrderSlice = createSlice({
  name: "selectedOrderStock",
  initialState,
  reducers: {
    addOrderSelected: (state, action: PayloadAction<string>) => {
      state.push(action.payload);
    },
    clearOrder: (state) => {
      return [];
    },
    removeOrderById: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((id) => id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addOrderSelected, clearOrder, removeOrderById } =
  selectedOrderSlice.actions;

export default selectedOrderSlice.reducer;
