import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  loginSuccess,
  setAuthInitialized,
} from "../redux/slices/authSlice";

import { getStoredAuth } from "../utils/authStorage";

function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getStoredAuth();

    if (auth) {
      dispatch(
        loginSuccess({
          token: auth.token,
          user: auth.user,
        })
      );
    }

    dispatch(setAuthInitialized());
  }, [dispatch]);

  return null;
}

export default AuthInitializer;