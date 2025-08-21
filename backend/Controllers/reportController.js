const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");

// Get all reports
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate("user", "username");
  if (!reports.length) {
    res.status(404);
    throw new Error("No reports found");
  }
  res.status(200).json({ message: "Get reports", reports });
});

// Get reports of logged-in user
const getUserReports = asyncHandler(async (req, res) => {
  const userReports = await Report.find({ user: req.user.id });
  if (!userReports.length) {
    res.status(404);
    throw new Error("No reports found");
  }
  res.status(200).json({ reports: userReports });
});

// Get report details
const getReportDetails = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("user", "username")
    .populate("comments", "user comment createdAt");
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  res.status(200).json(report);
});

// Create a new report
const setReport = asyncHandler(async (req, res) => {
  const { title, details, crimeType, position, street, document, date } =
    req.body;

  if (!title || !details || !crimeType || !position || !street || !date) {
    res.status(400);
    throw new Error("Please fill out all required fields");
  }

  const newReport = await Report.create({
    title,
    details,
    crimeType,
    position,
    street,
    document: document || "",
    date,
    user: req.user.id,
    status: "pending",
    comments: [],
    suggestion: "",
  });

  res.status(201).json({ message: "New report added", newReport });
});

// Update a report
const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Only author or admin can update
  if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not allowed to edit this report");
  }

  const {
    title,
    details,
    crimeType,
    position,
    street,
    document,
    status,
    suggestion,
  } = req.body;

  const updatedReport = await Report.findByIdAndUpdate(
    req.params.id,
    {
      title,
      details,
      crimeType,
      position,
      street,
      document,
      status,
      suggestion,
    },
    { new: true }
  );

  res.status(200).json({ message: "Report updated", updatedReport });
});

// Update report status and suggestion (Admin)
const updateReportSuggestion = asyncHandler(async (req, res) => {
  const { status, suggestion } = req.body;
  const reportId = req.params.id;

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'pending', 'approved' or 'rejected'");
  }

  const report = await Report.findById(reportId);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  if (req.user.role !== "admin") {
    res.status(401);
    throw new Error("Only admin can update report status");
  }

  report.status = status;
  report.suggestion = suggestion || "";
  await report.save();

  res.status(200).json({ message: "Report status updated", report });
});

// Delete a report
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Only author or admin can delete
  if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not allowed to delete this report");
  }

  // Delete report
  await report.deleteOne();

  res.status(200).json({ message: "Report and associated comments deleted" });
});

module.exports = {
  getReports,
  getUserReports,
  getReportDetails,
  setReport,
  updateReport,
  updateReportSuggestion,
  deleteReport,
};
