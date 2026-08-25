import {
  getMerchantProfile,
  updateMerchantProfile,
} from "../../api/merchantApi";

import {
  fetchMerchantProfileStart,
  fetchMerchantProfileSuccess,
  fetchMerchantProfileFailure,
} from "../slices/merchantSlice";

export const fetchMerchantProfile = () => {
  return async (dispatch) => {
    dispatch(fetchMerchantProfileStart());

    try {
      const data = await getMerchantProfile();

      dispatch(
        fetchMerchantProfileSuccess(data)
      );
    } catch (error) {
      dispatch(
        fetchMerchantProfileFailure(
          error.message
        )
      );
    }
  };
};

export const toggleMerchantStatus = () => {
  return async (dispatch, getState) => {
    const { merchant } = getState().merchant;

    if (!merchant) return;

    const updatedMerchant = {
      ...merchant,
      isOpen: !merchant.isOpen,
    };

    try {
      const data = await updateMerchantProfile(
        updatedMerchant
      );

      dispatch(
        fetchMerchantProfileSuccess(data)
      );
    } catch (error) {
      dispatch(
        fetchMerchantProfileFailure(
          error.message
        )
      );
    }
  };
};