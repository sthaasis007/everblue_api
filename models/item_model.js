const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Item type is required"],
      enum: ["lost", "found"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    media: {
      type: String,
      required: [true, "Media is required"],
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["photo"],
      default: "photo",
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["available", "claimed", "resolved"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Item", itemSchema);
