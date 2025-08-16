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
        position: {
          lat: action.payload.latlng.lat,
          lng: action.payload.latlng.lng,
        },
        street: action.payload.street,
        crimeType: action.payload.crimeType,
        title: action.payload.title,
        details: action.payload.details,
        date: action.payload.date,
        user: action.payload.user,
        status: "pending",
      });
      localStorage.setItem("reports", JSON.stringify(state.reports));
    },
    editReport: (state, action) => {
      const id = state.reports.find((r) => r.id === action.payload.id);
      if (id) {
        id.position = {
          lat: action.payload.latlng.lat,
          lng: action.payload.latlng.lng,
        };
        id.street = action.payload.street;
        id.crimeType = action.payload.crimeType;
        id.title = action.payload.title;
        id.details = action.payload.details;
        id.date = action.payload.date;
        localStorage.setItem("reports", JSON.stringify(state.reports));
      }
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(
        (report) => report.id != action.payload
      );
      localStorage.setItem("reports", JSON.stringify(state.reports));
    },
    approveReport: (state, action) => {
      const reportId = action.payload;
      const report = state.reports.find((r) => r.id === reportId);
      if (report && report.status === "pending") {
        report.status = "approved";
      }
      localStorage.setItem("reports", JSON.stringify(state.reports));
    },
  },
});

export const { addReport, editReport, deleteReport, approveReport } =
  reportSlice.actions;
export default reportSlice.reducer;
