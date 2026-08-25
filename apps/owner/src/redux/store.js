import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import merchantReducer from "./slices/merchantSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
      merchant: merchantReducer,
  },

});
