const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter region name"],
    },
    lat: {
      type: Number,
      require: [true, "Enter a latitude"],
    },
    lng: {
      type: Number,
      require: [true, "Enter a longitude"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Region", regionSchema);
