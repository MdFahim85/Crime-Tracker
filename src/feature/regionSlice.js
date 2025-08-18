import { createSlice } from "@reduxjs/toolkit";

const dhakaRegions = [
  { name: "Gulshan", latlng: [23.7965, 90.4141] },
  { name: "Banani", latlng: [23.7925, 90.4043] },
  { name: "Dhanmondi", latlng: [23.7461, 90.3742] },
  { name: "Uttara", latlng: [23.874, 90.3984] },
  { name: "Mirpur", latlng: [23.8223, 90.3654] },
  { name: "Motijheel", latlng: [23.7337, 90.417] },
  { name: "Mohammadpur", latlng: [23.7644, 90.358] },
  { name: "Badda", latlng: [23.7806, 90.4269] },
  { name: "Farmgate", latlng: [23.7565, 90.3913] },
  { name: "Shahbagh", latlng: [23.7389, 90.3959] },
  { name: "Tejgaon", latlng: [23.7639, 90.4031] },
  { name: "Khilgaon", latlng: [23.754, 90.4483] },
  { name: "Malibagh", latlng: [23.752, 90.4213] },
  { name: "Paltan", latlng: [23.7362, 90.4147] },
  { name: "Ramna", latlng: [23.7384, 90.4009] },
  { name: "Lalbagh", latlng: [23.7179, 90.3882] },
  { name: "Wari", latlng: [23.7108, 90.4217] },
  { name: "Jatrabari", latlng: [23.7104, 90.4501] },
  { name: "Kamalapur", latlng: [23.7325, 90.4254] },
  { name: "Hazaribagh", latlng: [23.7312, 90.3674] },
  { name: "Keraniganj", latlng: [23.707, 90.3454] },
  { name: "Demra", latlng: [23.7107, 90.498] },
  { name: "Savar", latlng: [23.834, 90.2988] },
  { name: "Tongi", latlng: [23.8917, 90.402] },
];

const regions = () => {
  const stored = localStorage.getItem("regions");
  return stored ? JSON.parse(stored) : dhakaRegions;
};

const initialState = {
  regionList: regions(),
};

const regionSlice = createSlice({
  name: "regions",
  initialState,
  reducers: {
    addRegion: (state, action) => {
      state.regionList.push({
        name: action.payload.name,
        latlng: action.payload.latlng,
      });
      localStorage.setItem("regions", JSON.stringify(state.regionList));
    },
    editRegion: (state, action) => {
      const region = state.regionList.find(
        (region) => region.name === action.payload.name
      );
      if (region) {
        region.latlng = action.payload.latlng;
        localStorage.setItem("regions", JSON.stringify(state.regionList));
      }
    },
    deleteRegion: (state, action) => {
      state.regionList = state.regionList.filter(
        (region) => region.name != action.payload
      );
      localStorage.setItem("regions", JSON.stringify(state.regionList));
    },
  },
});

export const { addRegion, editRegion, deleteRegion } = regionSlice.actions;
export default regionSlice.reducer;
