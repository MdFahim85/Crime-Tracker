import { createSlice } from "@reduxjs/toolkit";

const notifications = () => {
  const stored = localStorage.getItem("notifications");
  return stored ? JSON.parse(stored) : [];
};

const initialState = { notifications: notifications() };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        user: action.payload.user,
        message: action.payload.message,
        read: false,
      });
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) notification.read = true;
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
    clearNotifications: (state) => {
      state.notifications = notifications();
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
