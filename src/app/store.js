import { configureStore } from "@reduxjs/toolkit";

import reportReducer from "../feature/reportSlice";
import authReducer from "../feature/authSlice";
import commentReducer from "../feature/commentSlice";
import registerReducer from "../feature/registerSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
    auth: authReducer,
    comment: commentReducer,
    register: registerReducer,
  },
});

export default store;
