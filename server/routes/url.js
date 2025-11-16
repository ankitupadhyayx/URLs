const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

// Create Short URL
router.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl)
    return res.status(400).json({ error: "Original URL is required" });

  try {
    // Check duplicate
    const existing = await Url.findOne({ originalUrl });
    if (existing) return res.json(existing);

    // Create new short URL
    const shortCode = nanoid(8);

    const newUrl = new Url({
      originalUrl,
      shortCode,
    });

    await newUrl.save();
    res.json(newUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all URLs (for frontend listing)
router.get("/list/all", async (_req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete URL
router.delete("/:id", async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Deletion failed" });
  }
});

module.exports = router;
