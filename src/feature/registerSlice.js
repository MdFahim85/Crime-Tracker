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
    updateUser: (state, action) => {
      const updatedUser = action.payload;
      const user = state.users.find(
        (user) => user.username == updatedUser.username
      );
      if (user) {
        user.email = updatedUser.email;
        if (updatedUser.password) {
          user.password = updatedUser.password;
        }
        if (updatedUser.image) {
          user.image = updatedUser.image;
        }
        localStorage.setItem("registeredUsers", JSON.stringify(state.users));
        state.success = true;
        state.error = null;
        toast.success("Profile updated successfully!");
      } else {
        state.error = "User not found";
      }
    },
    updateRole: (state, action) => {
      const updatedUser = action.payload;
      const user = state.users.find(
        (user) => user.username == updatedUser.username
      );
      if (user) {
        user.role = updatedUser.role;

        localStorage.setItem("registeredUsers", JSON.stringify(state.users));
        state.success = true;
        state.error = null;
        toast.success("User Role updated successfully!");
      } else {
        state.error = "User not found";
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user.username != action.payload
      );
      localStorage.setItem("registeredUsers", JSON.stringify(state.users));
    },
  },
});

export const { registerUser, resetState, updateUser, updateRole, deleteUser } =
  registerSlice.actions;

export default registerSlice.reducer;
