import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    },

    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateOrderStatusSuccess: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) => order._id === updatedOrder._id
      );

      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatusSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;