const mongoose = require("mongoose");
const Comment = require("../models/commentModel");

const reportSchema = new mongoose.Schema(
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
      enum: [
        "Theft",
        "Assault",
        "Robbery",
        "Murder",
        "Vandalism",
        "Drugs",
        "Other",
      ],
    },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    street: {
      type: String,
      required: true,
    },
    image: { url: String, fileName: String },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    suggestion: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: { $in: doc.comments },
    });
    await Notification.deleteMany({
      reportId: doc._id,
    });
  }
});

module.exports = mongoose.model("Report", reportSchema);
