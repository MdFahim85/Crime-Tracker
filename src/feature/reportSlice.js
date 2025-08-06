import { createSlice } from "@reduxjs/toolkit";

const reports = () => {
  const stored = localStorage.getItem("reports");
  return stored ? JSON.parse(stored) : [];
};

const initialState = {
  reports: reports(),
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    addReport: (state, action) => {
      state.reports.push({
        id: action.payload.id,
        position: action.payload.latlng,
        street: action.payload.street,
        details: action.payload.details,
      });
      localStorage.setItem("reports", JSON.stringify(state.reports));
    },
  },
});

export const { addReport } = reportSlice.actions;
export default reportSlice.reducer;
