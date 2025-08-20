const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");

// Get Reports
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find();
  if (reports.length <= 0) {
    res.status(404);
    throw new Error("No reports found");
  }
  res.status(200).json({ message: "Get reports", reports });
});

const getUserReports = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userReports = await Report.find({ user: userId });
  if (userReports && userReports.length > 0) {
    res.json({ reports: userReports });
  } else {
    res.status(404);
    throw new Error("No reports found");
  }
});

const getReportDetails = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    throw new Error("Report not found");
  }
  res.json(report);
});

// Create Report
const setReport = asyncHandler(async (req, res) => {
  const { title, details, crimeType } = req.body;
  const userId = req.user.id;
  if (!title || !details || !crimeType) {
    res.status(400);
    throw new Error("Please fill out all the fields");
  }
  const newReport = await Report.create({
    title,
    details,
    crimeType,
    user: userId,
  });
  res.json({ message: `New report added`, newReport });
});

// Update Report
const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  const { title, details, crimeType } = req.body;
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  if (report.user != req.user.id) {
    res.status(401);
    throw new Error("You are not allowed to edit this report");
  }
  const updatedReport = await Report.findByIdAndUpdate(
    req.params.id,
    { title, details, crimeType },
    { new: true }
  );
  res
    .status(200)
    .json({ message: `Updated the ${req.params.id} report`, updatedReport });
});

// Delete Report
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (report.user != req.user.id) {
    res.status(401);
    throw new Error("You are not allowed to delete this report");
  }
  const deletedReport = await Report.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: `Deleted the ${req.params.id} report`, deletedReport });
});

module.exports = {
  getReports,
  getUserReports,
  getReportDetails,
  setReport,
  updateReport,
  deleteReport,
};
