const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");
const Region = require("../models/regionModel");
const User = require("../models/userModel");

const reportPagination = asyncHandler(async (req, res, next) => {
  const allRep = await Report.find().populate("user", "username");
  pagination(req, res, allRep);
  next();
});

const regionPagination = asyncHandler(async (req, res, next) => {
  const allReg = await Region.find();
  pagination(req, res, allReg);
  next();
});

const userPagination = asyncHandler(async (req, res, next) => {
  const allUser = await User.find();
  pagination(req, res, allUser);
  next();
});

const pagination = (req, res, data) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  if (endIndex < data.length) {
    result.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    result.prev = { page: page - 1, limit };
  }
  result.results = data.slice(startIndex, endIndex);
  res.paginatedData = result;
};

module.exports = { reportPagination, regionPagination, userPagination };
