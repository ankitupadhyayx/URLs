const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true, // Faster lookup
    },

    clicks: {
      type: Number,
      default: 0,
    },

    // 🔵 NEW FIELD → to store each user's URL separately
    userId: {
      type: String,
      required: true,
    },

    // Track all click timestamps for analytics
    clickHistory: [
      {
        type: Date,
        default: Date.now,
      }
    ]
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

module.exports = mongoose.model("Url", urlSchema);
