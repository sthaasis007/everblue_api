const asyncHandler = require("../middleware/async");
const Item = require("../models/item_model");
const path = require("path");
const fs = require("fs");


exports.createItem = asyncHandler(async (req, res) => {
  const { itemName, description, type, category, media } =
    req.body;

  // Create the item
  const item = await Item.create({
    itemName,
    description,
    type,
    category,
    media,
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
  if (req.query.category) filter.category = req.query.category;

  const total = await Item.countDocuments(filter);
  const items = await Item.find(filter)
    .populate("category", "name")
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
    .populate("category", "name");

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
    category,
    media,
    status,
  } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  // Authorization check: Make sure user owns this item
  if (item.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not authorized to update this item",
    });
  }

  // Update the item fields
  item.itemName = itemName || item.itemName;
  item.description = description || item.description;
  item.type = type || item.type;
  item.category = category || item.category;
  item.media = media || item.media;
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

  // Authorization check: Make sure user owns this item
  if (item.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not authorized to delete this item",
    });
  }

  // Remove the item's media file if it exists
  if (item.media && item.media !== "default.jpg") {
    // Check if it's a photo or video based on file extension
    const ext = path.extname(item.media).toLowerCase();
    let mediaPath;

    if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      mediaPath = path.join(__dirname, "../public/item_photos", item.media);
    } 

    if (mediaPath && fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath);
    }
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