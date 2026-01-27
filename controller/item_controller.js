const asyncHandler = require("../middleware/async");
const Item = require("../models/item_model");
const path = require("path");
const fs = require("fs");


exports.createItem = asyncHandler(async (req, res) => {
  const { itemName, description, type, price} =
    req.body;

  // Create the item
  const item = await Item.create({
    itemName,
    description,
    type,
    price,
  });

  res.status(201).json({
    success: true,
    data: item,
  });
});




exports.getAllItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.price) filter.price = req.query.price;

  const total = await Item.countDocuments(filter);
  const items = await Item.find(filter)
    // .populate("price", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: items,
  });
});




exports.getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate("price", "name");

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

exports.updateItem = asyncHandler(async (req, res) => {
  const {
    itemName,
    description,
    type,
    price,
    status,
  } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Update the item fields
  item.itemName = itemName || item.itemName;
  item.description = description || item.description;
  item.type = type || item.type;
  item.price = price || item.price;
  item.status = status || item.status;

  await item.save();

  res.status(200).json({
    success: true,
    data: item,
  });
});



exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  await Item.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Item deleted successfully",
  });
});



exports.uploadItemPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a photo file" });
  }

  // Check for the file size
  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).send({
      message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
    });
  }

  res.status(200).json({
    success: true,
    data: req.file.filename,
    message: "Item photo uploaded successfully",
  });
});