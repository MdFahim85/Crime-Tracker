const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Comment text is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
