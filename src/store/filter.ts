import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  stocks: {
    title: string;
    description: string;
    placeholder: string;
    defaultValue: number;
    type: string;
    key: "breadth" | "weight" | "gsm" | "quantity";
    active: boolean;
    greater: boolean;
  }[];
}

const initialState: FilterState = {
  stocks: [
    {
      title: "Breadth",
      description: "Filter by Breadth",
      placeholder: "24",
      defaultValue: 24,
      type: "number",
      key: "breadth",
      active: false,
      greater: true,
    },
    /*     {
      title: "Length",
      description: "Filter by Length",
      placeholder: "24",
      defaultValue: 24,
      type: "number",
      key: "length",
      active: false,
      greater: true,
    }, */
    {
      title: "Weight",
      description: "Filter by Weight",
      placeholder: "24",
      defaultValue: 24,
      type: "number",
      key: "weight",
      active: false,
      greater: true,
    },
    {
      title: "GSM",
      description: "Filter by Grams per Square Meter",
      placeholder: "24",
      defaultValue: 24,
      type: "number",
      key: "gsm",
      active: false,
      greater: true,
    },
    {
      title: "Quantity",
      description: "Filter by Quantity",
      placeholder: "24",
      defaultValue: 24,
      type: "number",
      key: "quantity",
      active: false,
      greater: true,
    },
  ],
};

export interface ApplyFilterPayload {
  key: string;
  group: "stocks";
  data: {
    active: boolean;
    greater: boolean;
    defaultValue: number;
  };
}

export interface DeactivateFilterPayload {
  key: string;
  group: "stocks";
}

export interface RemoveAllFilterPayload {
  group: "stocks";
}

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<ApplyFilterPayload>) => {
      const { key, group, data } = action.payload;
      state[group].map((item) => {
        if (item.key === key) {
          item.active = data.active;
          item.greater = data.greater;
          item.defaultValue = data.defaultValue;
        }
        return item;
      });
    },
    deactivateFilter: (
      state,
      action: PayloadAction<DeactivateFilterPayload>
    ) => {
      const { key, group } = action.payload;
      state[group].map((item) => {
        if (item.key === key) {
          item.active = false;
        }
        return item;
      });
    },
    removeAllFilters: (
      state,
      action: PayloadAction<RemoveAllFilterPayload>
    ) => {
      const { group } = action.payload;
      state[group].map((item) => {
        item.active = false;
        return item;
      });
    },
  },
});

export const { setFilter, deactivateFilter, removeAllFilters } =
  filterSlice.actions;

export default filterSlice.reducer;
