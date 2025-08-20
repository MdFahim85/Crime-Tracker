const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    details: {
      type: String,
      required: [true, "Please provide details"],
    },
    crimeType: {
      type: String,
      required: [true, "Please select a crime type"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
