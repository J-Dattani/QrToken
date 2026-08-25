import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  merchant: null,
  loading: false,
  error: null,
};

export const merchantSlice = createSlice({
  name: "merchant",
  initialState,
  reducers: {
    fetchMerchantProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMerchantProfileSuccess: (state, action) => {
      state.loading = false;
      state.merchant = action.payload;
    },
    fetchMerchantProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});     
export const {
  fetchMerchantProfileStart,
  fetchMerchantProfileSuccess,
  fetchMerchantProfileFailure,
} = merchantSlice.actions;

export default merchantSlice.reducer;