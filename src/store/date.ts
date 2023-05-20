import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const dateSlice = createSlice({
  name: "date",
  initialState: JSON.stringify(new Date()),
  reducers: {
    setDate(state, action: PayloadAction<Date>) {
      return JSON.stringify(action.payload);
    },
  },
});

export const { setDate } = dateSlice.actions;

export default dateSlice.reducer;
