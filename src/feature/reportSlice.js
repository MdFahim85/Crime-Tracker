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
        details: action.payload.details,
        date: action.payload.date,
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
  },
});

export const { addReport, editReport, deleteReport } = reportSlice.actions;
export default reportSlice.reducer;
