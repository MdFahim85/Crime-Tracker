import { createSlice } from "@reduxjs/toolkit";

const storedUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const initialState = {
  user: storedUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      (state.user = {
        username: action.payload.username,
        token: action.payload.token,
        image: action.payload.image,
        role: action.payload.role,
      }),
        localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
