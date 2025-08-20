import { configureStore } from "@reduxjs/toolkit";

import reportReducer from "../feature/reportSlice";
import authReducer from "../feature/authSlice";
import registerReducer from "../feature/registerSlice";
import regionReducer from "../feature/regionSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
    auth: authReducer,
    register: registerReducer,
    region: regionReducer,
  },
});

export default store;
