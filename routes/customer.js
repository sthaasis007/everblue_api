const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
} = require("../controllers/customer_controller");

router.post("/", createCustomer);
router.post("/login", loginCustomer);
router.put("/:id", protect, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

module.exports = router;