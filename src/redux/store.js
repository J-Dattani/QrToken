import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../customer/redux/slices/cartSlice";
import authReducer from "../owner/redux/slices/authSlice";
import merchantReducer from "../owner/redux/slices/merchantSlice";
import orderReducer from "../owner/redux/slices/orderSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    merchant: merchantReducer,
    orders: orderReducer,
  },
});
