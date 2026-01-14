const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  createStudent,
  updateStudent,
  deleteStudent,
  loginStudent,
} = require("../controllers/student_controller");

router.post("/", createStudent);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);