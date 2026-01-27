const Customer = require("../models/customer_model");
const asyncHandler = require("../middleware/async");
const fs = require("fs");
const path = require("path");

exports.createCustomer = asyncHandler(async (req, res) => {
    const {name, email, password, phoneNumber, profilePicture} = req.body;

    console.log("creating customer with name:", name);

    //check if customer already exists
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
    }

    //create customer
    const customer = await Customer.create({
        name,
        email,
        password,
        phoneNumber,
        profilePicture: profilePicture || "default-profile.png",
    });

    //remove password from response
    const customerResponse = customer.toObject();
    delete customerResponse.password;

    res.status(201).json({
        success: true,
        data: customerResponse,
    });
});

exports.loginCustomer = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide an email and password" });
    }

    // Check for customer
    const customer = await Customer.findOne({ email }).select("+password");

    if (!customer || !(await customer.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(customer, 200, res);
});

exports.getAllCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find();

  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers,
  });
});

exports.updateCustomer = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber, profilePicture } = req.body;
    
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Not authorized to update this customer" });
    }

    //update fields
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.password = password || customer.password;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.profilePicture = profilePicture || customer.profilePicture;

    if (password) {
        customer.password = password;
    }

    await customer.save();

    //remove password from response
    const customerResponse = customer.toObject();
    delete customerResponse.password;

    res.status(200).json({
        success: true,
        data: customerResponse,
    });
});

exports.deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    if (customer._id.toString() !== req.params.id) {
        return res.status(401).json({ message: "Not authorized to delete this customer" });
    }
      // Remove the student's profile picture if it exists
    if (
        customer.profilePicture &&
        customer.profilePicture !== "default-profile.png"
    ) {
        const profilePicturePath = path.join(
        __dirname,
        "../public/profile_pictures",
        student.profilePicture
        );
        if (fs.existsSync(profilePicturePath)) {
        fs.unlinkSync(profilePicturePath);
        }
    }

    await customer.deleteOne();

    res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
    });
});

exports.uploadProfilePicture = asyncHandler(async (req, res, next) => {
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
    message: "Profile picture uploaded successfully",
  });
});

// Get token from model, create cookie and send response

const sendTokenResponse = (customer, statusCode, res) => {
    // Create token
    const token = customer.getSignedJwtToken();

    const option = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        option.secure = true;
    }

    res.status(statusCode).cookie("token", token, option).json({
        success: true,
        token,
    });
};