require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const urlRoutes = require("./routes/url");

const app = express();

// Middleware
app.use(express.json());

// CORS — allows Netlify/Vercel + local
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);

// Remove deprecated warnings (Atlas driver no longer needs old options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// API Routes
app.use("/api/url", urlRoutes);

// Redirect Route (short URL handler)
app.get("/:code", async (req, res) => {
  const Url = require("./models/Url");
  const { code } = req.params;

  try {
    const record = await Url.findOne({ shortCode: code });

    if (!record) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Update click count + history
    record.clicks += 1;
    record.clickHistory.push(Date.now());
    await record.save();

    return res.redirect(record.originalUrl);
  } catch (err) {
    console.error("Redirect Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Default route for debugging (optional)
app.get("/", (req, res) => {
  res.send("URL Shortener Backend Running ✔");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
