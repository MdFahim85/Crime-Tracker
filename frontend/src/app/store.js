import { configureStore } from "@reduxjs/toolkit";

import reportReducer from "../feature/reportSlice";
import authReducer from "../feature/authSlice";
import regionReducer from "../feature/regionSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
    auth: authReducer,
    region: regionReducer,
  },
});

export default store;
