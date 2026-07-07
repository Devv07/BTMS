import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;

  user: any | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),

  user: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;

      state.user = action.payload.user;

      localStorage.setItem(
        "token",
        action.payload.token
      );
    },

    logout(state) {
      state.token = null;

      state.user = null;

      localStorage.removeItem("token");
    },
  },
});

export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;