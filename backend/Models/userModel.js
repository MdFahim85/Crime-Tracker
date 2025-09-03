const mongoose = require("mongoose");
const Comment = require("./commentModel");
const Report = require("./reportModel");
const Notification = require("./notificationModel");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Enter your username"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String },
    image: { url: String, fileName: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  const deletedComments = await Comment.find({
    _id: { $in: doc.comments },
  }).select("_id");
  const deletedCommentIds = deletedComments.map((c) => c._id);

  await Comment.deleteMany({ _id: { $in: doc.comments } });

  await Report.updateMany(
    { comments: { $in: deletedCommentIds } },
    { $pull: { comments: { $in: deletedCommentIds } } }
  );

  await Report.deleteMany({ user: doc._id });

  await Notification.deleteMany({ userId: doc._id });
});

module.exports = mongoose.model("User", userSchema);
