import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import merchantReducer from "./slices/merchantSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    merchant: merchantReducer,
    orders: orderReducer,
  },

});
