import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const loadUsersFromStorage = () => {
  try {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const initialState = {
  users: loadUsersFromStorage(),
  error: "",
  success: false,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const newUser = action.payload;
      const exists = state.users.find(
        (user) =>
          user.username === newUser.username || user.email === newUser.email
      );
      if (exists) {
        state.error = "Username or Email already registered";
        state.success = false;
      } else {
        state.users.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(state.users));
        state.error = null;
        state.success = true;
        toast.success("Registration successful!");
      }
    },
    resetState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
});

export const { registerUser, resetState } = registerSlice.actions;

export default registerSlice.reducer;
