const express = require("express");
const router = express.Router();
const { uploadImage } = require("../middleware/uploads");
const { protect } = require("../middleware/auth");

const {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomer,
  loginCustomer,
  uploadProfilePicture,
} = require("../controller/customer_controller");

// Error handler for upload endpoint
const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error("Upload error:", err);
    return res.status(400).json({ 
      message: err.message || 'File upload failed' 
    });
  }
  next();
};

router.post("/upload-image", protect, uploadImage.single("profilePicture"), handleUploadError, uploadProfilePicture);

router.post("/signup", createCustomer);
router.get("/", protect, getAllCustomer);
router.post("/login", loginCustomer);
router.put("/:id", protect, uploadImage.single("profilePicture"), handleUploadError, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

module.exports = router;