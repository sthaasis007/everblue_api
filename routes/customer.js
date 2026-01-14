const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  createStudent,
  updateStudent,
  deleteStudent,
  loginStudent,
} = require("../controllers/customer_controller");

router.post("/", createStudent);
router.post("/login", loginStudent);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;