require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const urlRoutes = require("./routes/url");
const authRoutes = require("./routes/auth"); // <- mounted auth routes

const app = express();

// Middleware
app.use(express.json());

// CORS — allow frontend(s)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -------------------------------
// API Routes
// -------------------------------
app.use("/api/url", urlRoutes);
app.use("/api/auth", authRoutes); // <-- auth routes mounted

// -------------------------------
// Redirect Route (short URL handler)
// -------------------------------
app.get("/:code", async (req, res) => {
  const Url = require("./models/Url");
  const code = req.params.code;

  try {
    const record = await Url.findOne({ shortCode: code });

    if (!record) return res.status(404).send("Short URL not found");

    record.clicks += 1;
    // ensure clickHistory array exists before pushing
    if (!Array.isArray(record.clickHistory)) record.clickHistory = [];
    record.clickHistory.push(Date.now());
    await record.save();

    return res.redirect(record.originalUrl);
  } catch (err) {
    console.error("Redirect Error:", err);
    res.status(500).send("Server error");
  }
});

// Default route for health-check / debugging
app.get("/", (req, res) => {
  res.send("URL Shortener Backend Running ✔");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
