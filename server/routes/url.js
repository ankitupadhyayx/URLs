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
    console.error("Shorten Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All URLs
router.get("/list/all", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete URL
router.delete("/:id", async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Deletion failed" });
  }
});

// Redirect Handler + Click Count
router.get("/:code", async (req, res) => {
  try {
    const record = await Url.findOne({ shortCode: req.params.code });

    if (!record) {
      return res.status(404).json({ error: "URL Not Found" });
    }

    // Update clicks + history
    record.clicks += 1;
    record.clickHistory.push(Date.now());
    await record.save();

    return res.redirect(record.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
