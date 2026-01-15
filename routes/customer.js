const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
} = require("../controller/customer_controller");

router.post("/signup", createCustomer);
router.post("/login", loginCustomer);
router.put("/:id", protect, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

module.exports = router;