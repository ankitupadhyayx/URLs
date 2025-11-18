// server/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES = "8h"; // token lifetime

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = { user: ADMIN_USER };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  return res.json({ token, user: ADMIN_USER });
});

// GET /api/auth/verify  (requires token in Authorization)
const requireAuth = require("../middleware/auth");
router.get("/verify", requireAuth, (req, res) => {
  // token valid
  res.json({ ok: true, user: req.admin.user || ADMIN_USER });
});

module.exports = router;
