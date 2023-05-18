import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import searchReducer from "./search";
import filterReducer from "./filter";
import selectedSpecsReducer from "./selectedSpecs";
import selectedStocksReducer from "./selectedStocks";
import selectedAddStockReducer from "./selectedAddStock";
import selectedOrderReducer from "./selectedOrder";
import userReducer from "./user";

const store = configureStore({
  reducer: {
    search: searchReducer,
    filter: filterReducer,
    selectedSpecs: selectedSpecsReducer,
    selectedStocks: selectedStocksReducer,
    selectedAddStock: selectedAddStockReducer,
    selectedOrder: selectedOrderReducer,
    user: userReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
