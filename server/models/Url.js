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
      index: true,  // Faster lookup
    },

    clicks: {
      type: Number,
      default: 0,
    },

    // Optional: Track all click timestamps (useful for analytics)
    clickHistory: [
      {
        type: Date,
        default: Date.now,
      }
    ]
  },
  {
    timestamps: true,   // adds createdAt, updatedAt automatically
  }
);

module.exports = mongoose.model("Url", urlSchema);
