const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");


// --------------------------------------
// ✅ CREATE SHORT URL (WITH userId)
// --------------------------------------
router.post("/shorten", async (req, res) => {
  const { originalUrl, userId } = req.body;

  if (!originalUrl)
    return res.status(400).json({ error: "Original URL is required" });

  if (!userId)
    return res.status(400).json({ error: "User ID missing" });

  try {
    // Check duplicate for SAME user
    const existing = await Url.findOne({ originalUrl, userId });
    if (existing) return res.json(existing);

    // Create short code
    const shortCode = nanoid(8);

    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId,
    });

    await newUrl.save();
    res.json(newUrl);
  } catch (err) {
    console.error("Shorten Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// --------------------------------------
// ✅ GET URL LIST → SPECIFIC USER
// --------------------------------------
router.get("/list/user/:userId", async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(urls);
  } catch (err) {
    console.error("List User Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


// --------------------------------------
// 🔵 ADMIN ROUTE → Get ALL URLs
// --------------------------------------
router.get("/list/all", async (_req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error("List All Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


// --------------------------------------
// 🗑 DELETE URL
// --------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Deletion failed" });
  }
});


// --------------------------------------
// 🔗 REDIRECT (placed AFTER /api routes)
// --------------------------------------
router.get("/r/:code", async (req, res) => {
  try {
    const record = await Url.findOne({ shortCode: req.params.code });

    if (!record) {
      return res.status(404).json({ error: "URL Not Found" });
    }

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
