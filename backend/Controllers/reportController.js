const asyncHandler = require("express-async-handler");
const Report = require("../Models/reportModel");
const Notification = require("../Models/notificationModel");
const User = require("../Models/userModel");
const { cloudinary } = require("../cloudinary");

// Get all reports
const getReports = asyncHandler(async (req, res) => {
  const { next, prev } = res.paginatedData;
  const reports = res.paginatedData.results;
  if (!reports.length) {
    res.status(404).json({ message: "No reports found" });
    return;
  }
  res.status(200).json({ reports, next, prev });
});

// Get reports of logged-in user
const getUserReports = asyncHandler(async (req, res) => {
  const { next, prev } = res.paginatedData;
  const reports = res.paginatedData.results;
  if (!reports.length) {
    res.status(404);
    throw new Error("No reports found");
  }
  res.status(200).json({ reports, next, prev });
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
  const { title, details, crimeType, lat, lng, street, date } = req.body;

  if (!title || !details || !crimeType || !lat || !lng || !street || !date) {
    res.status(400);
    throw new Error("Please fill out all required fields");
  }

  const newReport = await Report.create({
    title,
    details,
    crimeType,
    position: { lat, lng },
    street,
    image: { url: req.file?.path, fileName: req.file?.filename } || "",
    date,
    user: req.user.id,
    status: "pending",
    suggestion: "",
  });
  if (!newReport) {
    res.status(500).json({ message: "Failed to create report" });
  }
  res.status(201).json({ message: "Report submitted successfully", newReport });
});

// Update a report
const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Only author or admin can update
  if (
    report.user.toString() !== req.user.id &&
    req.user.role !== "admin" &&
    req.user.role !== "master_admin"
  ) {
    res.status(403);
    throw new Error("You are not allowed to edit this report");
  }

  const { title, details, crimeType, position, street, date } = req.body;

  const updatedReport = await Report.findByIdAndUpdate(
    req.params.id,
    {
      title: title || report.title,
      details: details || report.details,
      crimeType: crimeType || report.crimeType,
      position: position || report.position,
      street: street || report.street,
      image:
        { url: req.file?.path, fileName: req.file?.filename } ||
        report.document,
      date: date || report.date,
      status: "pending",
      suggestion: "",
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Report updated successfully", updatedReport });
});

// Update report status and suggestion (Admin)
const updateReportSuggestion = asyncHandler(async (req, res) => {
  const { status, suggestion } = req.body;
  const reportId = req.params.id;

  // Validate status
  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'pending', 'approved' or 'rejected'");
  }

  const report = await Report.findById(reportId);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Only admin or master_admin can update
  if (req.user.role !== "admin" && req.user.role !== "master_admin") {
    res.status(403);
    throw new Error("Only admin or master admin can update report status");
  }

  // Optional: prevent admins from updating other admins' reports
  const reportOwner = await User.findById(report.user);
  if (reportOwner.role === "admin" && req.user.role !== "master_admin") {
    res.status(403);
    throw new Error("Admins cannot update reports of other admins");
  }

  // Update
  report.status = status;
  report.suggestion = suggestion || "";
  await report.save();

  await Notification.create({
    userId: report.user,
    reportId: report._id,
    reportTitle: report.title,
    status: report.status,
  });

  res
    .status(200)
    .json({ message: "Report status updated successfully", report });
});

// Delete a report
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  // Only author or admin can delete
  if (
    report.user.toString() !== req.user.id &&
    req.user.role !== "admin" &&
    req.user.role !== "master_admin"
  ) {
    res.status(401);
    throw new Error("You are not allowed to delete this report");
  }

  // Delete report
  report.image.fileName &&
    (await cloudinary.uploader.destroy(report.image.fileName));
  await Report.findByIdAndDelete(req.params.id);

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
