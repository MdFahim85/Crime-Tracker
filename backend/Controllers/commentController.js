const asyncHandler = require("express-async-handler");
const Comment = require("../Models/commentModel");
const Report = require("../Models/reportModel");
const User = require("../Models/userModel");

// Get comments for a specific report
const getComments = asyncHandler(async (req, res) => {
  const reportId = req.params.id;
  const comments = await Comment.find({ report: reportId }).populate(
    "user",
    "username"
  );
  if (!comments.length) {
    res.status(404);
    throw new Error("No comments found for this report");
  }
  res.status(200).json({ message: "Comments found", comments });
});

// Post a new comment
const setComment = asyncHandler(async (req, res) => {
  const rep = await Report.findById(req.params.id);
  const authUser = await User.findById(req.user.id);
  const { comment } = req.body;
  const report = req.params.id;
  const user = req.user.id;

  if (!comment) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  const newComment = await Comment.create({ comment, user, report });
  rep.comments.push(newComment._id);
  authUser.comments.push(newComment._id);
  await rep.save();
  await authUser.save();
  res.status(201).json({ message: "Comment added successfully", newComment });
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Only author or admin can delete
  if (comment.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("You are not allowed to delete this comment");
  }

  if (comment.report.toString() !== req.params.id) {
    res.status(400);
    throw new Error("This comment does not belong to this report");
  }

  const deleted = await comment.deleteOne();
  await Report.findByIdAndUpdate(req.params.id, {
    $pull: { comments: req.params.commentId },
  });
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { comments: req.params.commentId },
  });

  const us = User.findById();

  if (deleted) {
    res.status(200).json({ message: "Comment deleted successfully" });
  } else {
    res.status(401);
    throw new Error("something went wrong");
  }
});

module.exports = { getComments, setComment, deleteComment };
