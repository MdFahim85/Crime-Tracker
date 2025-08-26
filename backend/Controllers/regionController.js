const asyncHandler = require("express-async-handler");
const Region = require("../models/regionModel");

const getAllRegions = asyncHandler(async (req, res) => {
  const regions = res.paginatedData.results;
  if (!regions) {
    res.status(404);
    throw new Error("No regions found");
  }
  res.json({ regions });
});

const setRegion = asyncHandler(async (req, res) => {
  const { name, lat, lng } = req.body;
  if (!name || !lat || !lng) {
    res.status(400);
    throw new Error("Provide region information");
  }
  const region = await Region.create({ name, lat, lng });
  if (!region) {
    res.status(400);
    throw new Error("Something went wrong");
  }
  res.json({ message: "New region added", region });
});

const updateRegion = asyncHandler(async (req, res) => {
  const region = await Region.findById(req.params.id);
  const { name, lat, lng } = req.body;
  const updatedRegion = await Region.findByIdAndUpdate(req.params.id, {
    name: name || region.name,
    lat: lat || region.lat,
    lng: lng || report.lng,
  });
  if (!updatedRegion) {
    res.status(400);
    throw new Error("Something went wrong");
  }
  res.json({ message: "Region has been updated", updatedRegion });
});

const deleteRegion = asyncHandler(async (req, res) => {
  const region = await Region.findById(req.params.id);
  if (!region) {
    res.status(400);
    throw new Error("Region not found");
  }
  await Region.findByIdAndDelete(req.params.id);
  res.json({ message: "Region has been deleted" });
});

module.exports = { getAllRegions, setRegion, updateRegion, deleteRegion };
