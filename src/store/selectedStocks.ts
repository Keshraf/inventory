import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectedStocksSchema = {
  id: string;
  ordered: number;
  transit: number;
  quantity: number;
  breadth: number;
  length: number | null;
  gsm: number;
  sheets: number;
  weight: number;
  qualityName: string;
  millName: string;
  invoice: string;
  /* client: string; */
};

type ChangeNumberPayload = {
  id: string;
  value: number;
  type: "changedOrdered" | "changedTransit" | "changedQuantity";
};

export type InitialState = SelectedStocksSchema & {
  changedOrdered: number;
  changedTransit: number;
  changedQuantity: number;
};

const initialState: InitialState[] = [];

export const selectedStocksSlice = createSlice({
  name: "selectedStock",
  initialState,
  reducers: {
    addSelectedStocks: (state, action: PayloadAction<SelectedStocksSchema>) => {
      state.push({
        ...action.payload,
        changedOrdered: action.payload.ordered,
        changedTransit: action.payload.transit,
        changedQuantity: action.payload.quantity,
      });
    },
    changeNumberStocks: (state, action: PayloadAction<ChangeNumberPayload>) => {
      state.map((item) => {
        if (item.id === action.payload.id)
          item[action.payload.type] = action.payload.value;
      });
    },
    resetSelectedStocks: () => {
      return [];
    },
    removeStocks: (state, action: PayloadAction<string>) => {
      state.forEach((item, index) => {
        if (item.id === action.payload) state.splice(index, 1);
      });
    },
  },
});

export const {
  addSelectedStocks,
  removeStocks,
  resetSelectedStocks,
  changeNumberStocks,
} = selectedStocksSlice.actions;

export default selectedStocksSlice.reducer;
