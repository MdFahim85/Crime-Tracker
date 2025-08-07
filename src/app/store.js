import { configureStore } from "@reduxjs/toolkit";

import reportReducer from "../feature/reportSlice";
import authReducer from "../feature/authSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
    auth: authReducer,
  },
});

export default store;
