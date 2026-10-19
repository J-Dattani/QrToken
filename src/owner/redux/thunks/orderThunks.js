import {
  getMerchantOrders,
  updateOrderStatus,
} from "../../api/orderApi";

import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatusSuccess,
} from "../slices/orderSlice";

export const fetchMerchantOrders = () => {
  return async (dispatch, getState) => {
    dispatch(fetchOrdersStart());

    try {
      const { merchant } = getState().merchant;

      if (!merchant?._id) {
        throw new Error("Merchant information not available");
      }

      const data = await getMerchantOrders(merchant._id);

      dispatch(fetchOrdersSuccess(data));
    } catch (error) {
      dispatch(
        fetchOrdersFailure(
          error.message || "Failed to fetch orders"
        )
      );
    }
  };
};

export const changeOrderStatus = (orderId, status) => {
  return async (dispatch) => {
    const data = await updateOrderStatus(
      orderId,
      status
    );

    dispatch(updateOrderStatusSuccess(data));
  };
};