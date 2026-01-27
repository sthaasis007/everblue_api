const express = require("express");
const router = express.Router();
const { uploadImage} = require("../middleware/uploads");
const { protect } = require("../middleware/auth");

const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  uploadItemPhoto,
} = require("../controller/item_controller");

// Upload routes (protected - user must be logged in to upload)
router.post("/upload-photo", protect, uploadImage.single("ItemPhoto"), uploadItemPhoto);

// CRUD routes
router.post("/new_item", protect, createItem);
router.get("/", protect, getAllItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem); // yo aaile chaleko xoina
router.delete("/:id", protect, deleteItem);

module.exports = router;
