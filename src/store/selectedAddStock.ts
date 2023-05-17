import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type selectedAddStockSchema = {
  id: string;
  millName: string;
  qualityName: string;
  breadth: number;
  weight: number;
  length: number | null;
  gsm: number;
  sheets: number;
  godownOrder: number;
  clientOrder: number;
  rate: number;
  client: string;
  invoice: string;
};

const initialState: selectedAddStockSchema[] = [];

export const selectedAddStockSlice = createSlice({
  name: "selectedAddStock",
  initialState,
  reducers: {
    addStockSelected: (
      state,
      action: PayloadAction<selectedAddStockSchema[]>
    ) => {
      state.push(...action.payload);
    },
    updateAddStockById: (
      state,
      action: PayloadAction<selectedAddStockSchema>
    ) => {
      const index = state.findIndex((stock) => stock.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    clearAddStock: (state) => {
      return [];
    },
    removeAddStockById: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((stock) => stock.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    setAllAddStockInvoice: (state, action: PayloadAction<string>) => {
      state.forEach((stock) => {
        stock.invoice = action.payload;
      });
    },
    setAllAddStockClient: (state, action: PayloadAction<string>) => {
      state.forEach((stock) => {
        stock.client = action.payload;
      });
    },
  },
});

export const {
  addStockSelected,
  updateAddStockById,
  removeAddStockById,
  clearAddStock,
  setAllAddStockInvoice,
  setAllAddStockClient,
} = selectedAddStockSlice.actions;

export default selectedAddStockSlice.reducer;
